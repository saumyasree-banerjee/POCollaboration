import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class TableSupplierDetais extends Component {

  showModal(e,poLineStatus,poLineID, index){
    e.preventDefault()
    let nagotiation = this.props.nagotiation, poStatus = this.props.poStatus
    this.props.showModal(poStatus, nagotiation, poLineStatus, poLineID, index)
    
  }

  render() {
    let tableHeader
    if(this.props.purchaseTableContent.length >= 1){
          tableHeader= (
          	<tr>
      	    	<th>Number</th>
      	    	<th>SKU</th>
      	    	<th>Description</th>
              <th>Quantity Original</th>
      	    	<th>Quantity Revision</th>
      	    	<th>Price Original</th>
              <th>Price Revision</th>
      	    	<th>Attachment</th>
      	    	<th>Status</th>
          	</tr>
          )
    } else {
      tableHeader = '';
    }

    let tableRow = this.props.purchaseTableContent.map((val,ind) => {
      let poStatus= val.PoLineNegotiationStatus
      let statusElement
      switch(poStatus){
        case'Pending':
        statusElement = <td><i className="fa fa-clock-o pending" aria-hidden="true" />{poStatus}</td>
        break
        case'Revision requested':
        statusElement = <td><i className="fa fa-pencil requested" aria-hidden="true" />{poStatus}</td>
        break
        case'Revised':
        statusElement = <td><i className="fa fa-pencil revised" aria-hidden="true" />{poStatus}</td>
        break
        case'Accepted':
        statusElement = <td><i className="fa fa-thumbs-up accepted" aria-hidden="true" />{poStatus}</td>
        break
        case'Declined':
        statusElement = <td><i className="fa fa-thumbs-down declined" aria-hidden="true" />{poStatus}</td>
        break 
        case'Cancelled':
        statusElement = <td><i className="fa fa-times-circle cancelled" aria-hidden="true" />{poStatus}</td>
        break
        default:
        statusElement = <td></td>
        break
      }
      let attachIcon;
      if(val.Attachments !== null) {
          if(val.Attachments.length>0){
              attachIcon = <i className="fa fa-paperclip" aria-hidden="true" />
          } else {
              attachIcon = null
          }
      } else {
        attachIcon=null
      }

      let index = ind + 1
      
    	return (
	    	<tr key={ind}>
		    	<td><Link to="" onClick={ (e)=> this.showModal(e, val.PoLineNegotiationStatus, val.PoLineId, index) }>{index}</Link></td>
		    	<td>{val.Value.SKU.OldValue}</td>
          <td>{val.Value.Description.OldValue}</td>
          <td>{val.Value.Quantity.OldValue}</td>
          <td>{(val.Value.Quantity.NewValue === null)? val.Value.Quantity.OldValue : val.Value.Quantity.NewValue}</td>
          <td>{val.Value.Price.OldValue}</td>
          <td>{(val.Value.Price.NewValue === null)? val.Value.Price.OldValue : val.Value.Price.NewValue }</td>
          <td>{attachIcon}</td>
          {statusElement}
	    	</tr>
    	)
    	
    });

    if(this.props.purchaseTableContent.length < 1){
      tableRow.push(<tr><td className="nodata"><div class="message info"><i aria-hidden="true" class="fa fa-info-circle fa-3x"></i><span id="message_success">No data found</span></div></td></tr>);
    }
    return (
        <div>
          <table id="dataTable" className="table table-striped">
            <thead>
                {tableHeader}
            </thead>
            <tbody>
                {tableRow}
            </tbody>
          </table>
        </div>
    )
  }
}


export default TableSupplierDetais