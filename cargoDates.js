import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

class CargoDates extends Component {
	constructor(props){
	    super(props);
	    this.handleChange = this.handleChange.bind(this);
	    this.state ={
	      value:'',
	      isCheckedStart_Date:false,
	      isCheckedEnd_Date:false,
	    }
	}

	handleChange(event) {
	    this.setState({value: event.target.value});
	}

	hideSaveSubmit = () =>{
		this.props.hideSaveSubmit();
		this.setState({value:""});
	}

	saveCargo = () =>{
		this.setState({'isCheckedEnd_Date':false});
		this.props.saveCargo(this.props.ProposedValuesEnd_DateForEdit);
	}

	handleChangeFrom = (date) => {
		this.props.handleChangeFrom(date);
    };

    handleChangeTo = (date) => {
      this.props.handleChangeTo(date);
    }; 

    toggleInput(event){
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            //console.log(name);
            //this.props.toggleInput(name,value);
            this.setState({
              [name]: value
            });
    }

    cancelCargo = () => {
    	this.setState({'isCheckedEnd_Date':false});
    	this.props.cancelCargo();
    }

	render(){
		let showHide = this.props.visibilityCargoDates ? {"display":"block"} : {"display":"none"};
		//console.log(this.props.modalContent.Values.CargoDate.CargoDate.OldValue);
		let currentStart_Date = this.props.ProposedValuesStart_DateForEdit || '';
        let currentEnd_Date = this.props.ProposedValuesEnd_DateForEdit || '';
		//style={this.props.getModal}
		let heightModal = { 'height': 400 };
		return(
			<div className="modal full-width single-row" style={showHide}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id="purchase_orders_details_modal_save" style={heightModal}>
                              <div className="modal-header"><strong className="modal-title">Purchase order Cargo Ready Date</strong><button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={() => this.cancelCargo()}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true" /></span></button></div>
                              <div className="modal-body double-modal">
                              	<div className="grid-wrapper">
	                              	<div className="col-50">
	                              		<h3 class="title-blue-underline">CURRENT</h3>
	                              		Cargo ready date
	                              		<br /><br />
	                              		<DatePicker
                                            selected={moment(currentStart_Date)}
                                            onChange={this.handleChangeFrom}
                                            placeholderText="dd/mm/yyyy"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control"
                                            type="text"
                                            name="EarliestShipDateFrom"
                                            disabled={!this.state.isCheckedStart_Date}
                                            readOnly={true}
                                          />
	                              	</div>
	                              	<div className="col-50">
	                              		<h3 class="title-blue-underline">REQUEST CHANGE</h3>
	                              		<input name="isCheckedEnd_Date" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.state.isCheckedEnd_Date}/> Cargo ready date
	                              		<br /><br />
	                              		<DatePicker
                                            selected={moment(currentEnd_Date)}
                                            onChange={this.handleChangeTo}
                                            placeholderText="dd/mm/yyyy"
                                            dateFormat="DD/MM/YYYY"
                                            className="form-control"
                                            type="text"
                                            name="EarliestShipDateTo"
                                            disabled={!this.state.isCheckedEnd_Date}
                                            readOnly={false}
                                          />
	                              	</div>
                              	</div>
                              </div>
			     			  <div className="modal-footer">
			     			  	<button type="button" className="button-large button-transparent" id="purchase_orders_request_cancel_btn" onClick={() => this.cancelCargo()}>{this.props.btnTitle1}</button>
			     			  	<button id="purchase_orders_details_modal_save_btn" onClick={() => this.saveCargo()} type="button" className="button-large button-blue" data-dismiss="modal">{this.props.btnTitle2}</button>
			     			  </div>
			     	</div>
                </div>
            </div>
		)
	}
}

export default CargoDates;