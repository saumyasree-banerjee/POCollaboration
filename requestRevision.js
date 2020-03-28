import React, { Component } from 'react';

class RequestRevision extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state ={
      reasonSeleced:[],
      value:'',
      allCheckBoxName:[],
    }
  }

  componentWillReceiveProps = () => {
    if(!this.props.visibilityRequestRevision){
       let reasonArray = this.props.requestData;
       for(let i = 0; i<reasonArray.length; i++){
          let name = 'checkbox' + i;
          let obj = {};
          obj[name] = false
          this.setState(obj);
       }
    } 
  }



	hideRequestModal = () => {
    this.setState({value:'',reasonSeleced:[]})
    this.props.hideRequestModal();
	}

  submitRequestModal = () => {
    let getReasonArray = this.state.reasonSeleced;
    let textArea = this.state.value;
    

    let originalRequestData = this.props.requestData;

    let createArray = [];

    let i = 0;
    for(i; i<getReasonArray.length; i++){
      for(let obj in originalRequestData){
        if(getReasonArray[i]=== (originalRequestData[obj].id).toString()){
          createArray.push({
            "id": getReasonArray[i]*1 ,
            "selected":false,
            "reason":originalRequestData[obj].reason
          });
        }
      }
      
    }

    this.props.submitRequestModal(createArray,textArea);
    let allCheckBoxName = this.state.allCheckBoxName;
    for(let i = 0; i<allCheckBoxName.length; i++){
          const name = allCheckBoxName[i];
          let obj = {};
          obj[name] = true
          this.setState(obj);
    }
    this.setState({reasonSeleced:[], value:''});
    this.hideRequestModal();
  }

  reasonCheckUncheck = (e) =>{
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
          [name]: value
      });

      let setReasonArray = this.state.reasonSeleced;
      if(e.target.checked === true){
          setReasonArray.push(e.target.value);
      } else {
          var index = setReasonArray.indexOf(e.target.value);
          if (index > -1) {
              setReasonArray.splice(index, 1);
          }
      }
      this.setState({reasonSeleced:setReasonArray});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

	render(){
    let modalCssVisibilty = (this.props.visibilityRequestRevision) ? {display:'block'} : {display:'none'}, self = this;
    let reasonArray = this.props.requestData;
    let reasonContent = reasonArray.map((val,i) => {
            let checkBox = 'checkbox' + i;
            let checkUncheck = self.state[checkBox] || '';
            let ids = val.reason.replace(/ /g,'_')
            return (
                    <div key={i}>
                      <input name={checkBox} checked={checkUncheck} className="fa fa-square-o" type="checkbox" onChange={this.reasonCheckUncheck} value={val.id || ''} id={ids} />
                      <label>{val.reason}</label>
                    </div>
                  );
    });

		return(
			<div className="modal full-width double-column" style={modalCssVisibilty} id="purchase_orders_request">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <strong className="modal-title">Request revision</strong>
                  <button type="button" id="purchase_orders_request_close" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideRequestModal}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
                </div>
                <div className="modal-body single-modal">
                  <div className="vertical-form">
                    <div className="grid-wrapper">
                      <div className="col-50">
                        <aside className="logged-aside">
                          <form className="checkboxes-logged-in">
                            <fieldset>
                              <label>Reason(s) for requesting revision</label>
                              {reasonContent}
                            </fieldset>
                          </form>
                        </aside>
                      </div>
                      <div className="col-50">
                        <div className="form-group"><label htmlFor="exampleInputEmail1">Personal message</label>
                          <textarea rows="6" maxLength="500" id="purchase_orders_request_message" className="form-control" value={this.state.value} onChange={this.handleChange}></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="button-large button-transparent" id="purchase_orders_request_cancel" onClick={this.hideRequestModal}>Cancel</button>
                  <button type="button" className="button-large button-blue" data-dismiss="modal" onClick={this.submitRequestModal} id="purchase_orders_request_submit" >Submit Request</button>
                </div>
              </div>
            </div>
      </div> 
		)
	}
}

export default RequestRevision;