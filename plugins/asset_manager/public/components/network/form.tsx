import React from 'react';

import {
    EuiFieldText,
    EuiFieldNumber,
    EuiForm,
    EuiFormRow,
    EuiFlexItem,
    EuiFlexGroup,
    EuiButton
  } from '@elastic/eui';

type formInput={
        network : string,
        name  : string,
        tags : string,
        lat : number,
        lon : number,
        priority: number,
        clone : boolean,
        handleChange : (e:any)=> void,
        saveItem: ()=> void
    }

  const networkRegex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/([0-9]|1[0-9]|2[0-9]|3[0-2]))$/
  function ItemForm({network,name,tags,lat,lon,priority,clone,handleChange,saveItem}:formInput) {
    return(
    <EuiForm component="form">
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Network">
                <EuiFieldText 
                    name="network" 
                    value={network}
                    onChange={handleChange}
                    isInvalid={!networkRegex.test(network)}
                    placeholder="192.168.0.0/24"
                />
            </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiFormRow label="Name">
                    <EuiFieldText 
                        name="name" 
                        value={name}
                        onChange={handleChange}
                        isInvalid={name.length == 0}
                    />
                </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiFormRow label="Tags">
                    <EuiFieldText 
                        name="tags" 
                        value={tags}
                        onChange={handleChange}
                        placeholder="Tg1, Tg2"
                    />
                </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiFormRow label="Latitude">
                    <EuiFieldText
                        name="lat" 
                        value={lat}
                        onChange={handleChange}
                    />
                </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiFormRow label="Longitude">
                    <EuiFieldText 
                        name="lon" 
                        value={lon}
                        onChange={handleChange}
                    />
                </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
                <EuiFormRow label="Priority">
                    <EuiFieldNumber 
                        name="priority" 
                        value={priority}
                        onChange={handleChange}
                    />
                </EuiFormRow>
            </EuiFlexItem>      
            <EuiFlexItem grow={false}>        
                <EuiFormRow label="save">
                    <EuiButton
                        color="primary"
                        isDisabled={network.length == 0 || name.length == 0 || !networkRegex.test(network)}
                        size="m"
                        onClick={saveItem}
                        >
                        {clone?"clone":"save"}
                    </EuiButton>
                </EuiFormRow>
            </EuiFlexItem>
        </EuiFlexGroup>
    </EuiForm>
    )
  }
  
  export {ItemForm};