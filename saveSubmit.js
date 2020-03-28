import React, { Component } from 'react';

class SaveSubmit extends Component {
	constructor(props){
	    super(props);
	    this.handleChange = this.handleChange.bind(this);
	    this.state ={
	      value:'',
	    }
	}

	handleChange(event) {
	    this.setState({value: event.target.value});
	}

	hideSaveSubmit = () =>{
		this.props.hideSaveSubmit();
		this.setState({value:""});
	}

	sendSaveSubmit = () =>{
		this.props.sendSaveSubmit(this.state.value);
		this.props.hideSaveSubmit();
	}

	render(){
		let showHide = this.props.visibilitySaveSubmit ? {"display":"block"} : {"display":"none"};
		return(
			<div className="modal full-width single-row" style={showHide}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content" id="purchase_orders_details_modal_save">
                              <div className="modal-header"><strong className="modal-title">Save and submit</strong><button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={() => this.hideSaveSubmit()}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true" /></span></button></div>
                              <div className="modal-body double-modal">
                              	<div className="form-group"><label>Description of changes</label>
		                            <textarea rows="6" id="purchase_orders_request_message" className="form-control" value={this.state.value} onChange={this.handleChange}></textarea>
		                        </div>
                              </div>
			     			  <div className="modal-footer">
			     			  	<button type="button" className="button-large button-transparent" id="purchase_orders_request_cancel_btn" onClick={() => this.hideSaveSubmit()}>{this.props.btnTitle1}</button>
			     			  	<button id="purchase_orders_details_modal_save_btn" onClick={() => this.sendSaveSubmit()} type="button" className="button-large button-blue" data-dismiss="modal">{this.props.btnTitle2}</button>
			     			  </div>
			     	</div>
                </div>
            </div>
		)
	}
}

export default SaveSubmit;