import React from 'react';
import {
    EuiSpacer,
    EuiPageContentBody,
    EuiPageContent,
    EuiTitle
  } from '@elastic/eui';

import {ItemForm} from './form';
import { ItemTable } from './list';
import {PLUGIN_ID} from '../../../common'


const AssetNetworkIndex = "utility-asset-network";

  class Network extends React.Component{
      state={
        selectedItem:{
            id:undefined,
            name:"",
            network: "",
            tags:"",
            lat: 51.39109,
            lon: 35.70305,
            priority: 100,
            clone:false,
        },
        pageOfItems:[],
        totalItemCount: 0
    }

    handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const selectedItem = this.state.selectedItem;
      selectedItem[e.target.name] = ["priority"].includes(e.target.name)? parseInt(e.target.value) : e.target.value ;
      this.setState({
          selectedItem
      });
  }

  findItems = (pageIndex, pageSize, sortField, sortDirection,query_string) => { 
    let from = pageIndex * pageSize; 
    let sortFieldName = ["name","network"].includes(sortField)? `${sortField}.keyword`:sortField;
    const request_body= {
        index: AssetNetworkIndex,
        query: query_string || "*" ,
        from:from,
        size:pageSize,
        sort:`${sortFieldName}:${sortDirection}`,
    };
    this.props.http.post(`/api/${PLUGIN_ID}/elastic/search`,  {body:JSON.stringify(request_body)})
    .then(resp => {
            const hits = resp.body.hits;
            const items = [];
            if (hits && parseInt(hits.total.value) >= from ) {
                // get items :
                        hits.hits.map((item,idx ) => {
                        items[idx] = {...item._source ,id :item._id,record_number:from+idx+1};                    
                    });
                }
                // we in some pages and then search something , after search no items get back then need to go to first page
                else{
                    this.setState({
                        pageOfItems : [],
                        totalItemCount: hits.total.value
                    },() => {this.findItems(0, pageSize, sortField, sortDirection,query_string)});
                    return
                }

                this.setState({
                    pageOfItems:items,   
                    totalItemCount: hits.total.value                     
                });                
        }  )
    .catch(err =>{
            this.props.notifications.toasts.addWarning(
                        {title:'Can not get data',
                        text:err.body.message,
                    }
                        )}
            );
            
}

etitItem = (id,clone=false) => { 
        const request_body= {
            index: AssetNetworkIndex,
            body:{"size":1,"query":{"bool":{"must":[{"term":{"_id":id}}]}}}, 
        };
        this.props.http.post(`/api/${PLUGIN_ID}/elastic/search`,  {body:JSON.stringify(request_body)})
        .then(resp => {
                const hits = resp.body.hits;
                let selectedItem = {};
                if (hits && parseInt(hits.total.value) >= 1 ) {
                            selectedItem = {...hits.hits[0]._source ,id:hits.hits[0]._id,clone:clone}
                        this.setState({selectedItem})
                        
                        this.props.notifications.toasts.addSuccess( {title:'Item selected' })
                    }      
                    else{
                            this.setState({selectedItem:{}})                                
                            this.props.notifications.toasts.addWarning( {title:'No item found' })
                        }         
            }  )
        .catch(err =>{
                this.props.notifications.toasts.addWarning(
                            {title:'Can not get data',
                            text:err.body.message,
                            })
                
                this.setState({selectedItem:{}})        
            });                
}


saveItem = () => { 
    const request_body= {
        index: AssetNetworkIndex,
        id: this.state.selectedItem.clone? undefined: this.state.selectedItem.id,
        body: (({ id, clone, ...o }) => o)(this.state.selectedItem), 
    };
    this.props.http.post(`/api/${PLUGIN_ID}/elastic/index`,  {body:JSON.stringify(request_body)})
    .then(resp => {
        this.props.notifications.toasts.addSuccess( {title:'Item saved' }) 
        const pageOfItems = this.state.pageOfItems
        if (this.state.selectedItem.id != undefined && this.state.selectedItem.clone == false){
            pageOfItems.map((item,idx) => {
                if (item.id == this.state.selectedItem.id){
                    pageOfItems[idx] = this.state.selectedItem
                    this.setState({ 
                        pageOfItems
                    }) 
                }
            })
        }

        this.setState({ 
            selectedItem:{
                id:undefined,
                name:"",
                network: "",
                tags:"",
                lat: 51.39109,
                lon: 35.70305,
                priority: 100,
                clone: false,
            }
        })                            
        }  )
    .catch(err =>{
            this.props.notifications.toasts.addWarning(
                        {title:'Can not save data',
                        text:err.body.message,
                        })
            
            this.setState({selectedItem:{}})        
        });                
}
deleteItems= (ids , pageIndex, pageSize, sortField, sortDirection,query_string) => {
    const request_body= {
        index: AssetNetworkIndex,
        body:{"query":{"bool":{"must":[{"terms":{"_id":ids}}]}}}, 
    };

    this.props.http.post(`/api/${PLUGIN_ID}/elastic/delete_by_query`,  {body:JSON.stringify(request_body)})
    .then(resp => {  
        this.props.notifications.toasts.addSuccess( {title:'Items deleted' })

        setTimeout(() => { this.findItems(pageIndex, pageSize, sortField, sortDirection,this.state.query_string);}, 1000)
       }) 
    .catch(err =>{
            this.props.notifications.toasts.addWarning(
                        {title:'Can not delete data',
                        text:err.body.message,
                    }
                      )}
            );      
}





    render(){

        return(
            <EuiPageContent>
              <EuiTitle>
                <h2>Network</h2>
              </EuiTitle>
              <EuiSpacer />
              <EuiPageContentBody>
              <ItemForm 
                    network={this.state.selectedItem.network}
                    name={this.state.selectedItem.name}    
                    tags={this.state.selectedItem.tags}        
                    lat={this.state.selectedItem.lat}
                    lon={this.state.selectedItem.lon}
                    priority={this.state.selectedItem.priority}
                    clone={this.state.selectedItem.clone}
                    handleChange={this.handleChange}
                    saveItem={this.saveItem}
 
                    >
                </ItemForm>
                <EuiSpacer />                
                <ItemTable 
                    pageOfItems={this.state.pageOfItems} 
                    totalItemCount={this.state.totalItemCount}
                    deleteItems={this.deleteItems}
                    editItem={this.etitItem}
                    findItems={this.findItems}
                ></ItemTable>
              </EuiPageContentBody>
            </EuiPageContent>
        )
    }
  }

  export default Network;