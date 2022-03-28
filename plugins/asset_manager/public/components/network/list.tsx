import React, { useState,useEffect, Fragment } from 'react';
import {
  EuiBasicTable,
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';

export const ItemTable = ({pageOfItems,totalItemCount,deleteItems,editItem,findItems}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("priority");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [queryString, setQueryString] = useState('*');
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  useEffect(()=> {
    findItems(pageIndex, pageSize, sortField, sortDirection,queryString)},[])

  const handleKeyUp = (e) =>{
    if (e.key === 'Enter') {
      findItems(pageIndex, pageSize, sortField, sortDirection,queryString);
    }
  }
  const onTableChange = ({ page = {}, sort = {} }) => {
    const { index: pageIndex, size: pageSize } = page;

    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
    findItems(pageIndex, pageSize, sortField, sortDirection,queryString)
  };

  const onSelectionChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  const onClickDelete = () => {
    deleteItems([...selectedItems.map((item) => item.id)],pageIndex, pageSize, sortField, sortDirection);

    setSelectedItems([]);
  };

  const renderDeleteButton = () => {
    if (selectedItems.length === 0) {
      return;
    }
    return (
      
      <EuiFlexItem  grow={false}>
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} Items
      </EuiButton>
      </EuiFlexItem>

    );
  };

  const deleteButton = renderDeleteButton();

  const columns = [      
    {
        field: "record_number",
        name: "#",
        sortable: false,
        truncateText: false, 
        width:"60px",
        mobileOptions:{fullWidth:false,enlarge:true}  
    },
    {
      field: 'network',
      name: 'Network',
      sortable: true,
      truncateText: true,
      mobileOptions: {
        show: false,
      },
    },   
    {
      field: 'name',
      name: 'Name',
      sortable: true,
      truncateText: true,
      mobileOptions: {
        show: false,
      },
    }, 
    {
      field: 'tags',
      name: 'Tags',
    },
    {
      field: 'lat',
      name: 'Latitude'
    },
    {
      field: 'lon',
      name: 'Longitude'
    },,
    {
      field: 'priority',
      name: 'Priority',
      sortable: true
    },
    {
      name: 'Actions',
      actions: [
        {
          name: 'Edit',
          description: 'Edit Item',
          icon: 'indexEdit',
          type: 'icon',
          color: 'primary',
          onClick: (item) => {editItem(item.id,false);},
      },   
      {
          name: 'Clone',
          description: 'Clone Item',
          icon: 'copy',
          type: 'icon',
          onClick: (item) => {editItem(item.id,true);},
      }
      ],
    }
  ];

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [5,10,50],
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const selection = {
    selectable: (item) => {return true},
    onSelectionChange: onSelectionChange,
    };

  return (
    <Fragment>
      <EuiFlexGroup>
          {deleteButton}
        <EuiFlexItem>
          <EuiFieldText
            placeholder="Query String (lucene)"
            value={queryString}
            fullWidth
            onChange={(event) => {setQueryString(event.target.value)}}
            onKeyUp={handleKeyUp}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
      
          <EuiButton
                color="primary"
                isDisabled={false}
                size="m"
                fill
                onClick={() => { findItems(pageIndex, pageSize, sortField, sortDirection,queryString)}}
              >
                Refresh
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="s" />
        <EuiBasicTable
          tableCaption="Demo of EuiBasicTable with expanding rows"
          items={pageOfItems}
          itemId="id"
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          isExpandable={true}
          hasActions={true}
          columns={columns}
          pagination={pagination}
          sorting={sorting}
          isSelectable={true}
          selection={selection}
          onChange={onTableChange}
        />
    </Fragment>
  );
};