import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'

class SingleModal extends Component{
    cancelModal = () => { 
        this.props.cancelModal()
    }

    hideModal = () => {
        let nagotiation = this.props.nagotiation;
        let saveObj= this.props.modalContent;
        let poLineId= this.props.modalContent.PoLineId;
        let poStatus = this.props.poStatus;
        let attachmentNew = this.props.filename || [];
        let attachmentOld = this.props.ProposedValuesAttachedFileForEdit || [];
        let attachmentArray = [...attachmentNew, ...attachmentOld];
        this.props.cancelModal(nagotiation, poStatus, poLineId, saveObj, attachmentArray);
    }

    saveModal = () => { 
        let nagotiation = this.props.nagotiation;
        let saveObj= this.props.modalContent;
        let poLineId= this.props.modalContent.PoLineId;
        let poStatus = this.props.poStatus;
        let attachmentNew = this.props.filename || [];
        let attachmentOld = this.props.ProposedValuesAttachedFileForEdit || [];
        let attachmentArray = [...attachmentNew, ...attachmentOld];
        this.props.saveModal(nagotiation, poStatus, poLineId, saveObj, attachmentArray);
    }

    uploadFunc = (fileNamesDisplay, input, modalPoID, modalPoLineID, nagotiation) => {
        this.props.uploadFunc(fileNamesDisplay, input, modalPoID, modalPoLineID, nagotiation)
        input.value = ''
    }

    deleteFile = (e, inputFileElementt, AttachmentId, nagotiation) => {
        this.props.deleteFile(e, inputFileElementt, AttachmentId, nagotiation)
    }  

    render(){
        let currentInd = this.props.modalInd;
        
        let currentSKU = this.props.modalContent.Value.SKU.OldValue || '';
        let currentDescription = this.props.modalContent.Value.Description.OldValue || '';
        let currentStart_Date = this.props.modalContent.Value.Start_Date.OldValue || '';
        let currentEnd_Date = this.props.modalContent.Value.End_Date.OldValue || '';
        let currentQuantity = this.props.modalContent.Value.Quantity.OldValue || '';
        let currentPrice = this.props.modalContent.Value.Price.OldValue || '';
        let currentColor = this.props.modalContent.Value.Color.OldValue || '';
        let currentSize = this.props.modalContent.Value.Size.OldValue || '';
        let currentIncoterms = this.props.modalContent.Value.Incoterms.OldValue || '';
        let currentUnit = this.props.modalContent.Value.Unit.OldValue || '';
        
        let currentHtsCode = this.props.modalContent.Value.HtsCode.OldValue || '';
        let currentCurrency = this.props.modalContent.Value.PriceCurrency.OldValue || '';


       

        let revesionAttachedFile = this.props.ProposedValuesAttachedFileForEdit || '';

        let fileNamesDisplay = []
        if(revesionAttachedFile) {
          revesionAttachedFile.forEach((val, ind) => {
          let idName = "upload_form_file_input_" + (ind + 1), idNameArray = []
          idNameArray[0] = idName
          idNameArray[1] = revesionAttachedFile
          fileNamesDisplay[ind] = <div id={idName} key={ind}>
                                      <br/>
                                      <a href={val.Path} download={val.Name} className="small-link-text">{val.Name}</a>
                                      <br/>
                                  </div>
            }
          )
        }

        return(
            <div className="modal medium" style={this.props.getModal}>
                <div className="modal-dialog" role="document">
                           <div className="modal-content" id="purchase_orders_details_modal_single">
                              <div className="modal-header"><strong className="modal-title">&nbsp;</strong><button id="purchase_orders_details_modal_close" type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={this.props.hideModal}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true" /></span></button></div>
                              <div className="modal-body single-modal" >
                                <div className="filter-header"><h3 className="title-blue-underline"> Purchase Order Header </h3></div>
                                <div className="vertical-form">
                                        <div id="purchase_orders_details_modal_header">
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"> 
                                                    <label>Earliest ship date (from)</label> 
                                                    <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_from"> 
                                                      <DatePicker
                                                                selected={moment(currentStart_Date)}
                                                                onChange={this.handleChangeFrom}
                                                                placeholderText="dd/mm/yyyy"
                                                                dateFormat="DD/MM/YYYY"
                                                                className="form-control"
                                                                type="text"
                                                                name="EarliestShipDateFrom"
                                                                disabled={true}
                                                                readOnly={true}
                                                                dropdownMode="select"
                                                                //maxDate={moment(this.props.startDateTo)}
                                                      />
                                                      <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                    </div> 
                                                  </div>
                                                </div>
                                             
                                                 <div className="col-50">
                                                    <div className="form-group"><label htmlFor="exampleInputEmail1">Earliest ship date (to)</label>
                                                      <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_to"> 
                                                      <DatePicker
                                                                selected={moment(currentEnd_Date)}
                                                                onChange={this.handleChangeTo}
                                                                placeholderText="dd/mm/yyyy"
                                                                dateFormat="DD/MM/YYYY"
                                                                className="form-control"
                                                                type="text"
                                                                name="EarliestShipDateTo"
                                                                disabled={true}
                                                                readOnly={true}
                                                                dropdownMode="select"
                                                                //maxDate={moment(this.props.startDateTo)}
                                                      />
                                                      <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                    </div>
                                                    </div>
                                                 </div>
                                          </div>
                                          <div className="grid-wrapper">
                                              <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Incoterms</label><input type="text" className="form-control" id="purchase_orders_details_modal_header_incoterms" aria-describedby="" placeholder="" value={currentIncoterms} disabled /></div>
                                              </div>
                                          </div>
                                        </div>
                                        <div className="filter-header"><h3 className="title-blue-underline"> Purchase Order Line {currentInd} </h3></div>
                                        <div id="purchase_orders_details_modal_poline">
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">SKU</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_sku" aria-describedby="" placeholder="" value={currentSKU} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Description</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_description" aria-describedby="" placeholder="" defaultValue={currentDescription} disabled /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Quantity</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_quantity" aria-describedby="" placeholder="" value={currentQuantity} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Unit</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_unit" aria-describedby="" placeholder="" value={currentUnit} disabled /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Price ({currentCurrency})</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_price" aria-describedby="" placeholder="" value={currentPrice} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">HTS code</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_htccode" aria-describedby="" placeholder="" disabled value={currentHtsCode} /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Color</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_color" aria-describedby="" placeholder="" value={currentColor} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Size</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_size" aria-describedby="" placeholder="" value={currentSize} disabled /></div>
                                             </div>
                                          </div>
                                          
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group">
                                                  <label >Attachment <span className="red-error-text">{this.props.ProposedValuesAttachmentForEditError}</span></label>
                                                  <input id="upload_form_file_input" ref={input => this.inputFileElement = input} type="file" className="hidden" defaultValue="success" onChange={() => { this.uploadFunc(revesionAttachedFile, this.inputFileElement, this.props.modalPoID, this.props.modalPoLineID, this.props.nagotiation)}}/>
                                                  <div className="input-btn-wrapper">
                                                    <input type="text" className="form-control" aria-describedby="" placeholder="" value="" onClick={() => { this.inputFileElement.click()}} readOnly/>
                                                    <button type="button" className="select-btn" onClick={() => { this.inputFileElement.click()}}><span className="fa fa-folder-open"></span></button>
                                                  </div>
                                                  {fileNamesDisplay}
                                                </div>
                                             </div>
                                             <div className="col-50"></div>
                                          </div>
                                        </div>
                                </div>
                              </div>
                              {
                                (!this.props.readOnlyModal)?
                                  <div className="modal-footer"><button onClick={() => this.saveModal()} id="purchase_orders_details_modal_save_sigle" type="button" className="button-large button-blue" data-dismiss="modal" disabled={this.props.errorSave}>{this.props.btnTitle2}</button></div>
                                : 
                                null
                              }
                           </div>
                </div>
            </div>
        )
    }
}

class DoubleModal extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state={
            ProposedValuesPoLineId:this.props.modalContent.PoLineId,
            ProposedValuesSKU:this.props.modalContent.Value.Description.NewValue,
            ProposedValuesDescription:this.props.modalContent.Value.Description.NewValue,
            ProposedValuesStart_Date: this.props.modalContent.Value.Start_Date.NewValue,
            ProposedValuesEnd_Date: this.props.modalContent.Value.End_Date.NewValue,
            ProposedValuesQuantity: this.props.modalContent.Value.Quantity.NewValue,
            ProposedValuesPrice: this.props.modalContent.Value.Price.NewValue,
            ProposedValuesColor: this.props.modalContent.Value.Color.NewValue,
            ProposedValuesSize: this.props.modalContent.Value.Size.NewValue,
            ProposedValuesIncoterms: this.props.modalContent.Value.Incoterms.NewValue,
            ProposedValuesUnit: this.props.modalContent.Value.Unit.NewValue,
            ProposedValuesHtsCode: this.props.modalContent.Value.HtsCode.NewValue,
            ProposedValuesAttachedFile: this.props.modalContent.Attachments.map((vl,i) => {
              return vl.Name;
            }),

        }
    }

    
    cancelModal = (event) => { 
        let resetData = {
            ResetValuesPoLineIdForEdit:this.state.ProposedValuesPoLineId,
            ResetValuesSKUForEdit:this.state.ProposedValuesSKU,
            ResetValuesDescriptionForEdit:this.state.ProposedValuesDescription,
            ResetValuesStart_DateForEdit:this.state.ProposedValuesStart_Date,
            ResetValuesEnd_DateForEdit:this.state.ProposedValuesEnd_Date,
            ResetValuesQuantityForEdit: this.state.ProposedValuesQuantity,
            ResetValuesPriceForEdit: this.state.ProposedValuesPrice,
            ResetValuesColorForEdit: this.state.ProposedValuesColor,
            ResetValuesSizeForEdit: this.state.ProposedValuesSize,
            ResetValuesHtsCodeForEdit: this.state.ProposedValuesHtsCode,
        };
        this.props.cancelModal(resetData);
    }

    hideModal = () => {
        let resetData = {
            ResetValuesPoLineIdForEdit:this.state.ProposedValuesPoLineId,
            ResetValuesSKUForEdit:this.state.ProposedValuesSKU,
            ResetValuesDescriptionForEdit:this.state.ProposedValuesDescription,
            ResetValuesStart_DateForEdit:this.state.ProposedValuesStart_Date,
            ResetValuesEnd_DateForEdit:this.state.ProposedValuesEnd_Date,
            ResetValuesQuantityForEdit: this.state.ProposedValuesQuantity,
            ResetValuesPriceForEdit: this.state.ProposedValuesPrice,
            ResetValuesColorForEdit: this.state.ProposedValuesColor,
            ResetValuesSizeForEdit: this.state.ProposedValuesSize,
            ResetValuesHtsCodeForEdit: this.state.ProposedValuesHtsCode,
            ResetValuesAttachedFileForEdit: this.state.ProposedValuesAttachedFile,
        };
        this.props.hideModal(resetData);
    }

    saveModal = () => { 

        let nagotiation = this.props.nagotiation;
        let saveObj= this.props.modalContent;
        let poLineId= this.props.modalContent.PoLineId;
        let poStatus = this.props.poStatus;

        let attachmentNew = this.props.filename || [];
        let attachmentOld = this.props.ProposedValuesAttachedFileForEdit || [];
        

        let attachmentArray = [...attachmentNew, ...attachmentOld];

        
        this.props.saveModal(nagotiation, poStatus, poLineId, saveObj, attachmentArray);
    }   

    handleChange(event) {
            const evt = event;
            const target = evt.target;
            const value = target.value;
            const name = target.name;
            this.props.handleChange(event, name,value);
    }

    uploadFunc = (fileNamesDisplay, input, modalPoID, modalPoLineID, nagotiation) => {
        this.props.uploadFunc(fileNamesDisplay, input, modalPoID, modalPoLineID, nagotiation)
        input.value = ''
    }

    deleteFile = (e, inputFileElementt, AttachmentId, nagotiation) => {
        this.props.deleteFile(e, inputFileElementt, AttachmentId, nagotiation)
    }
    
    preventNumberInput = e => {
        this.props.preventNumberInput(e)
    }

    toggleInput(event){
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            this.props.toggleInput(name,value);
    }

    handleChangeFrom = (date) => {
      this.props.handleChangeFrom(date);
    };

    handleBlurFrom = (e) =>{
      let self = this;
      let val = (e.target.value).replace(/\//g,'-');
      let newdate = val.split("-").reverse().join("-");

      if (!moment(newdate, 'YYYY-MM-DD', true).isValid() || (moment(newdate).diff(moment().format('YYYY-MM-DD')) < 0)  || ( moment(newdate).diff(moment(this.props.ProposedValuesEnd_DateForEdit).format('YYYY-MM-DD')) > 0)   ) {
          self.datePickerFrom.clear()
          self.props.handleBlurFrom(moment(this.state.ProposedValuesStart_Date).format('YYYY-MM-DD'));  

       } 
    }

    handleChangeTo = (date) => {
      this.props.handleChangeTo(date);
    };  

    handleBlurTo = (e) => {
      let self = this;
      let val = (e.target.value).replace(/\//g,'-');
      var newdate = val.split("-").reverse().join("-");
      if (!moment(newdate, 'YYYY-MM-DD', true).isValid() || (moment(newdate).diff(moment().format('YYYY-MM-DD')) < 0) || ( moment(newdate).diff(moment(this.state.ProposedValuesStart_Date).format('YYYY-MM-DD')) < 0)  ) {
          self.datePickerTo.clear()
          self.props.handleBlurTo(moment(this.state.ProposedValuesEnd_Date).format('YYYY-MM-DD'));
        } 
    }

    onChangeStartDateFrom = (event) => {
      let enteredDate = moment(event.target.value,"DD-MM-YYYY");
      if(enteredDate._isValid)
      {
          this.setState({
              inputDateForStartDateForm: enteredDate
          }, () => {
          });
      }else {
          event.target.value = "";
          this.setState({
              inputDateForStartDateForm: null
          });
      }
  };

  onChangeStartDateTo = (event) => {
      let enteredDate = moment(event.target.value,"DD-MM-YYYY");
      if(enteredDate._isValid)
      {
          this.setState({
              inputDateForStartDateTo: enteredDate
          }, () => {
          });
      }else {
          event.target.value = "";
          this.setState({
              inputDateForStartDateTo: null
          });
      }
  }; 

  clearDatePickerStartDateFrom = (event) => {
      event.persist();
        this.setState({
            inputDateForStartDateForm: null
        }, () => {
            this._calendar1.setSelected(null,event,false);
        });
        this._calendar1.setOpen(false);
    }; 

    clearDatePickerStartDateTo = (event) => {
      event.persist();
        this.setState({
            inputDateForStartDateTo: null
        }, () => {
            this._calendar2.setSelected(null,event,false);
        });
        this._calendar2.setOpen(false);
    };


    render(){
        let currentInd = this.props.modalInd;
        let currentSKU = this.props.modalContent.Value.SKU.OldValue;
        let currentDescription = this.props.modalContent.Value.Description.OldValue;
        let currentStart_Date = this.props.modalContent.Value.Start_Date.OldValue;
        let currentEnd_Date = this.props.modalContent.Value.End_Date.OldValue;
        let currentQuantity = this.props.modalContent.Value.Quantity.OldValue;
        let currentPrice = this.props.modalContent.Value.Price.OldValue;
        let currentColor = this.props.modalContent.Value.Color.OldValue;
        let currentSize = this.props.modalContent.Value.Size.OldValue;
        let currentIncoterms = this.props.modalContent.Value.Incoterms.OldValue;
        let currentUnit = this.props.modalContent.Value.Unit.OldValue;
        let currentHtsCode = this.props.modalContent.Value.HtsCode.OldValue;
        let currentCurrency = this.props.modalContent.Value.PriceCurrency.OldValue || '';
        let revesionStart_Date = this.props.ProposedValuesStart_DateForEdit || '';
        let revesionEnd_Date = this.props.ProposedValuesEnd_DateForEdit || '';
        let revesionQuantity = this.props.ProposedValuesQuantityForEdit || '';
        let revesionPrice = this.props.ProposedValuesPriceForEdit || '';
        let revesionIncoterms = this.props.ProposedValuesIncotermsForEdit || '';
        let revesionUnit = this.props.ProposedValuesUnitForEdit || '';
        let revesionAttachedFile = this.props.ProposedValuesAttachedFileForEdit || '';
        
        

        let fileNamesDisplay = []
        if(revesionAttachedFile) {
          revesionAttachedFile.forEach((val, ind) => {
          let idName = "upload_form_file_input_" + (ind + 1), idNameArray = []
          idNameArray[0] = idName
          idNameArray[1] = revesionAttachedFile
          fileNamesDisplay[ind] = <div id={idName} key={ind}>
                                      <br/>
                                      <a href={val.Path} download={val.Name} className="small-link-text">{val.Name}</a>
                                      <br/>
                                  </div>
            }
          )
        }

        return(
            <div className="modal large" style={this.props.getModal}>
                <div className="modal-dialog" role="document">
                           <div className="modal-content" id="purchase_orders_details_modal_double">
                              <div className="modal-header"><strong className="modal-title">&nbsp;</strong><button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={this.props.hideModal}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true" /></span></button></div>
                              <div className="modal-body single-modal" >
                                <div className="filter-header"><h3 className="title-blue-underline">Purchase Order Header</h3></div>
                                <div className="grid-wrapper" id="purchase_orders_details_modal_header">
                                  <div className="col-50">
                                      <div className="vertical-form">
                                          <div className="grid-wrapper title" ><strong className="modal-title">ORIGINAL</strong></div>
                                          <div className="grid-wrapper">
                                                <div className="col-50">
                                                  <div className="form-group"> 
                                                    <label>Earliest ship date (from)</label> 
                                                    <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_from"> 
                                                      <DatePicker
                                                                selected={moment(currentStart_Date)}
                                                                placeholderText="dd/mm/yyyy"
                                                                dateFormat="DD/MM/YYYY"
                                                                className="form-control"
                                                                type="text"
                                                                name="EarliestShipDateFrom"
                                                                disabled={true}
                                                                readOnly={true}
                                                                dropdownMode="select"
                                                      />
                                                      <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                    </div> 
                                                  </div>
                                                </div>
                                             
                                                 <div className="col-50">
                                                    <div className="form-group"><label htmlFor="exampleInputEmail1">Earliest ship date (to)</label>
                                                      <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_to"> 
                                                      <DatePicker
                                                                selected={moment(currentEnd_Date)}
                                                                placeholderText="dd/mm/yyyy"
                                                                dateFormat="DD/MM/YYYY"
                                                                className="form-control"
                                                                type="text"
                                                                name="EarliestShipDateTo"
                                                                disabled={true}
                                                                readOnly={true}
                                                                dropdownMode="select"
                                                      />
                                                      <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                    </div>
                                                    </div>
                                                 </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Incoterms</label><input type="text" className="form-control" id="purchase_orders_details_modal_header_incoterms" aria-describedby="" placeholder="" value={currentIncoterms} disabled /></div>
                                             </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-50">
                                      <div className="vertical-form">
                                            <div className="grid-wrapper title"><strong className="modal-title">REQUESTED REVISION</strong></div>
                                            <div className="grid-wrapper">
                                               <div className="col-50">
                                                  <div className="form-group"> 
                                                      {
                                                        (!this.props.readOnlyModal)?
                                                        <input name="isCheckedStart_Date" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedStart_Date}/>
                                                        : null
                                                      }
                                                      <label>Earliest ship date (from)(DD/MM/YY) <span className="red-error-text">{this.props.ProposedValuesStart_DateForEditError}</span></label> 
                                                      <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_from_edit"> 
                                                        <DatePicker
                                                                  selected={moment(revesionStart_Date)}
                                                                  onChange={this.handleChangeFrom}
                                                                  onBlur={this.handleBlurFrom}
                                                                  placeholderText="dd/mm/yyyy"
                                                                  dateFormat="DD/MM/YYYY"
                                                                  className="form-control"
                                                                  type="text"
                                                                  name="EarliestShipDateFrom"
                                                                  disabled={!this.props.isCheckedStart_Date}
                                                                  popperPlacement="bottom-end"
                                                                  minDate={moment()}
                                                                  maxDate={moment(revesionEnd_Date)}
                                                                  //onChangeRaw={this.onChangeStartDateFrom}
                                                                  //ref={(c) => this._calendar1 = c}
                                                                  readOnly={false}
                                                                  //showYearDropdown
                                                                  //yearDropdownItemNumber={5}
                                                                  //showMonthDropdown
                                                                  //useShortMonthInDropdown
                                                                  //dropdownMode="select"
                                                                  ref={datePickerFrom => {this.datePickerFrom = datePickerFrom}}
                                                        />
                                                        <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                      </div> 
                                                    </div>
                                                  </div>
                                               
                                                   <div className="col-50">
                                                      <div className="form-group">
                                                        {
                                                          (!this.props.readOnlyModal)?
                                                          <input name="isCheckedEnd_Date" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedEnd_Date}/> 
                                                          : null 
                                                        }
                                                        <label htmlFor="exampleInputEmail1">Earliest ship date (to)(DD/MM/YY) <span className="red-error-text">{this.props.ProposedValuesEnd_DateForEditError}</span></label>
                                                        <div className="input-btn-wrapper" id="purchase_orders_details_modal_header_earliest_ship_date_to_edit"> 
                                                        <DatePicker
                                                                  selected={moment(revesionEnd_Date)}
                                                                  onChange={this.handleChangeTo}
                                                                  onBlur={this.handleBlurTo}
                                                                  placeholderText="dd/mm/yyyy"
                                                                  dateFormat="DD/MM/YYYY"
                                                                  className="form-control"
                                                                  type="text"
                                                                  name="EarliestShipDateTo"
                                                                  disabled={!this.props.isCheckedEnd_Date}
                                                                  popperPlacement="bottom-end"
                                                                  minDate={ moment(revesionStart_Date)}
                                                                  //onChangeRaw={this.onChangeStartDateTo}
                                                                  //ref={(c) => this._calendar2 = c}
                                                                  //showYearDropdown
                                                                  //yearDropdownItemNumber={5}
                                                                  //showMonthDropdown
                                                                  //useShortMonthInDropdown
                                                                  //dropdownMode="select"
                                                                  ref={datePickerTo => {this.datePickerTo = datePickerTo}}
                                                        />
                                                        <button type="button" className="select-btn"><span className="fa fa-calendar" /></button>
                                                      </div>
                                                      </div>
                                                   </div>
                                            </div>
                                            <div className="grid-wrapper">
                                               <div className="col-50">
                                                  <div className="form-group">
                                                  {
                                                    (!this.props.readOnlyModal)?
                                                    <input name="isCheckedIncoterms" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedIncoterms}/>
                                                  : null 
                                                  }
                                                  <label htmlFor="exampleInputEmail1">Incoterms <span className="red-error-text">{this.props.ProposedValuesIncotermsForEditError}</span></label><input type="text" name="ProposedValuesIncotermsForEdit" className="form-control" id="purchase_orders_details_modal_header_incoterms_edit" aria-describedby="" placeholder="" value={revesionIncoterms} onChange={(e) => this.handleChange(e)} disabled={!this.props.isCheckedIncoterms} /></div>
                                               </div>
                                            </div>
                                      </div>
                                  </div>
                                </div>
                                <div className="filter-header"><h3 className="title-blue-underline">Purchase Order Line {currentInd}</h3></div>
                                <div className="grid-wrapper" id="purchase_orders_details_modal_poline">
                                  <div className="col-50">
                                      <div className="vertical-form">
                                          <div className="grid-wrapper title"><strong className="modal-title">ORIGINAL</strong></div>
                                          <div className="grid-wrapper">
                                              <div className="col-50">
                                                  <div className="form-group"><label htmlFor="exampleInputEmail1">SKU</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_sku" aria-describedby="" placeholder="" value={currentSKU || ''} disabled /></div>
                                               </div>
                                               <div className="col-50">
                                                  <div className="form-group"><label htmlFor="exampleInputEmail1">Description</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_description" aria-describedby="" placeholder="" defaultValue={currentDescription} disabled /></div>
                                               </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Quantity</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_quantity" aria-describedby="" placeholder="" value={currentQuantity || ''} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Unit</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_unit" aria-describedby="" placeholder="" value={currentUnit || ''} disabled /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Price ({currentCurrency})</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_price" aria-describedby="" placeholder="" value={currentPrice || ''} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">HTS code</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_htccode" aria-describedby="" placeholder="" disabled value={currentHtsCode} /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Color</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_color" aria-describedby="" placeholder="" value={currentColor} disabled /></div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group"><label htmlFor="exampleInputEmail1">Size</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_size" aria-describedby="" placeholder="" value={currentSize} disabled /></div>
                                             </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-50">
                                    <div className="vertical-form">
                                          <div className="grid-wrapper title" ><strong className="modal-title">REQUESTED REVISION</strong></div>
                                          <div className="grid-wrapper">
                                               <div className="col-50">
                                                  <div className="form-group"><label htmlFor="exampleInputEmail1">SKU</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_sku_edit" aria-describedby="" placeholder="" value={currentSKU || ''} disabled /></div>
                                               </div>
                                               <div className="col-50">
                                                  <div className="form-group"><label htmlFor="exampleInputEmail1">Description</label><input type="text" className="form-control" id="purchase_orders_details_modal_poline_description_edit" aria-describedby="" placeholder="" defaultValue={currentDescription} disabled /></div>
                                               </div>
                                          </div>
                                          
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group">
                                                  {
                                                    (!this.props.readOnlyModal)?
                                                    <input name="isCheckedQuantity" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedQuantity}/>
                                                    : null
                                                  }
                                                  <label htmlFor="exampleInputEmail1">Quantity <span className="red-error-text">{this.props.ProposedValuesQuantityForEditError}</span></label><input type="text" name="ProposedValuesQuantityForEdit" className="form-control" id="purchase_orders_details_modal_poline_quantity_edit" aria-describedby="" placeholder="" value={revesionQuantity} onChange={this.handleChange} onKeyDown={(event) => this.preventNumberInput(event)} onKeyUp={(event) => this.preventNumberInput(event)} disabled={!this.props.isCheckedQuantity} />
                                                </div>
                                             </div>
                                             <div className="col-50">
                                                <div className="form-group">
                                                {
                                                  (!this.props.readOnlyModal)?
                                                  <input name="isCheckedUnit" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedUnit}/>
                                                  : null 
                                                }
                                                <label htmlFor="exampleInputEmail1">Unit <span className="red-error-text">{this.props.ProposedValuesUnitForEditError}</span></label><input type="text" name="ProposedValuesUnitForEdit" className="form-control" id="purchase_orders_details_modal_poline_unit_edit" aria-describedby="" placeholder="" value={revesionUnit} onChange={(e) => this.handleChange(e)} disabled={!this.props.isCheckedUnit} /></div>
                                             </div>
                                          </div>
                                          <div className="grid-wrapper">
                                             <div className="col-50">
                                                <div className="form-group">
                                                {
                                                  (!this.props.readOnlyModal)?
                                                  <input name="isCheckedPrice" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedPrice}/>
                                                : null
                                                }
                                                <label htmlFor="exampleInputEmail1">Price ({currentCurrency}) <span className="red-error-text">{this.props.ProposedValuesPriceForEditError}</span></label><input type="text" name="ProposedValuesPriceForEdit" className="form-control" id="purchase_orders_details_modal_poline_price_edit" aria-describedby="" placeholder="" value={revesionPrice} onChange={(e) => this.handleChange(e)} onKeyDown={(event) => this.preventNumberInput(event)} onKeyUp={(event) => this.preventNumberInput(event)} disabled={!this.props.isCheckedPrice} />
                                                </div>
                                             </div>
                                             
                                             <div className="col-50">
                                                <div className="form-group">
                                                {
                                                  (!this.props.readOnlyModal)?
                                                  <input name="isCheckedAttachedFile" type="checkbox" onChange={(e) => this.toggleInput(e)} checked={this.props.isCheckedAttachedFile}/>
                                                  : null 
                                                }
                                                <label >Attachment <span className="red-error-text">{this.props.ProposedValuesAttachmentForEditError}</span></label>
                                                <input id="upload_form_file_input" ref={input => this.inputFileElement = input} type="file" className="hidden" defaultValue="success" onChange={() => { this.uploadFunc(revesionAttachedFile, this.inputFileElement, this.props.modalPoID, this.props.modalPoLineID, this.props.nagotiation)}}/>
                                                <div className="input-btn-wrapper">
                                                  <input disabled={!this.props.isCheckedAttachedFile} type="text" className="form-control" aria-describedby="" placeholder="" value="" onClick={() => { this.inputFileElement.click()}} readOnly/>
                                                  <button disabled={!this.props.isCheckedAttachedFile} type="button" className="select-btn" onClick={() => { this.inputFileElement.click()}}><span className="fa fa-folder-open"></span></button>
                                                </div>
                                                {fileNamesDisplay} 
                                                </div>
                                             </div>
                                          </div>
                                      </div>
                                  </div>
                                </div>
                                
                                 
                              </div>
                              {
                                (!this.props.readOnlyModal)? 
                                <div className="modal-footer"><button id="purchase_orders_details_modal_double_cancel" onClick={(event) => this.cancelModal(event)} type="button" className="button-large button-transparent">{this.props.btnTitle1}</button><button disabled={this.props.errorSave} id="purchase_orders_details_modal_save_double" onClick={() => this.saveModal()} type="button" className="button-large button-blue" data-dismiss="modal">{this.props.btnTitle2}</button></div> 
                                : null
                              }
                           </div>
                </div>
            </div>
        )
    }
}

class ModalMain extends Component{

    getModal(){
        return (this.props.modal) ? {display: 'block'} : {display: 'none'};
    }

    render(){
        let modalContent;
        if(this.props.modalType === 'singleModal'){
            modalContent = <SingleModal 
                              nagotiation={this.props.nagotiation} 
                              poStatus={this.props.poStatus} 
                              readOnlyModal={this.props.readOnlyModal} 
                              errorSave={this.props.errorSave} 
                              cancelModal={this.props.cancelModal} 
                              saveModal={this.props.saveModal} 
                              uploadFunc={this.props.uploadFunc} 
                              deleteFile={this.props.deleteFile} 
                              filename={this.props.filename}
                              modalPoID={this.props.modalPoID} 
                              modalPoLineID={this.props.modalPoLineID} 
                              ProposedValuesAttachedFileForEdit={this.props.ProposedValuesAttachedFileForEdit} 
                              ProposedValuesAttachmentForEditError={this.props.ProposedValuesAttachmentForEditError} 
                              modalContent={this.props.modalContent} 
                              modalInd={this.props.modalInd} 
                              modalstatus={this.props.modalstatus} 
                              modalNegotiation={this.props.modalNegotiation} 
                              getModal={this.getModal()}  
                              hideModal={this.props.hideModal} 
                              btnTitle1={this.props.btnTitle1} 
                              btnTitle2={this.props.btnTitle2} 
                            />
        } else if (this.props.modalType === 'doubleModal') {
            
            modalContent = <DoubleModal 
                              nagotiation={this.props.nagotiation} 
                              poStatus={this.props.poStatus} 
                              readOnlyModal={this.props.readOnlyModal} 
                              errorSave={this.props.errorSave} 
                              handleChange={this.props.handleChange} 
                              preventNumberInput={this.props.preventNumberInput} 
                              uploadFunc={this.props.uploadFunc} 
                              deleteFile={this.props.deleteFile} 
                              filename={this.props.filename}
                              handleChangeFrom={this.props.handleChangeFrom} 
                              handleBlurFrom = {this.props.handleBlurFrom}
                              handleChangeTo={this.props.handleChangeTo} 
                              handleBlurTo = {this.props.handleBlurTo}
                              cancelModal={this.props.cancelModal} 
                              saveModal={this.props.saveModal} 
                              modalContent={this.props.modalContent} 
                              modalInd={this.props.modalInd} 
                              modalstatus={this.props.modalstatus} 
                              modalNegotiation={this.props.modalNegotiation}
                              modalPoID={this.props.modalPoID} 
                              modalPoLineID={this.props.modalPoLineID}  
                              getModal={this.getModal()} 
                              hideModal={this.props.hideModal} 
                              btnTitle1={this.props.btnTitle1} 
                              btnTitle2={this.props.btnTitle2} 
                              ProposedValuesPoLineIdForEdit={this.props.ProposedValuesPoLineIdForEdit} 
                              ProposedValuesPoLineIdForEditError={this.props.ProposedValuesPoLineIdForEditError} 
                              ProposedValuesStart_DateForEdit={this.props.ProposedValuesStart_DateForEdit} 
                              ProposedValuesStart_DateForEditError={this.props.ProposedValuesStart_DateForEditError}  
                              ProposedValuesEnd_DateForEdit={this.props.ProposedValuesEnd_DateForEdit} 
                              ProposedValuesEnd_DateForEditError={this.props.ProposedValuesEnd_DateForEditError} 
                              ProposedValuesQuantityForEdit={this.props.ProposedValuesQuantityForEdit} 
                              ProposedValuesQuantityForEditError={this.props.ProposedValuesQuantityForEditError} 
                              ProposedValuesPriceForEdit={this.props.ProposedValuesPriceForEdit} 
                              ProposedValuesPriceForEditError={this.props.ProposedValuesPriceForEditError} 
                              ProposedValuesIncotermsForEdit={this.props.ProposedValuesIncotermsForEdit} 
                              ProposedValuesIncotermsForEditError={this.props.ProposedValuesIncotermsForEditError} 
                              ProposedValuesUnitForEditError={this.props.ProposedValuesUnitForEditError} 
                              ProposedValuesUnitForEdit={this.props.ProposedValuesUnitForEdit} 
                              ProposedValuesHtsCodeForEdit={this.props.ProposedValuesHtsCodeForEdit} 
                              ProposedValuesHtsCodeForEditError={this.props.ProposedValuesHtsCodeForEditError} 
                              ProposedValuesAttachedFileForEdit={this.props.ProposedValuesAttachedFileForEdit} 
                              ProposedValuesAttachedFileForEditError={this.props.ProposedValuesAttachedFileForEditError} 
                              ProposedValuesAttachmentForEditError={this.props.ProposedValuesAttachmentForEditError}
                              toggleInput={this.props.toggleInput} 
                              isCheckedStart_Date={this.props.isCheckedStart_Date} 
                              isCheckedEnd_Date={this.props.isCheckedEnd_Date} 
                              isCheckedQuantity={this.props.isCheckedQuantity} 
                              isCheckedPrice={this.props.isCheckedPrice} 
                              isCheckedIncoterms={this.props.isCheckedIncoterms} 
                              isCheckedUnit={this.props.isCheckedUnit} 
                              isCheckedHtsCode={this.props.isCheckedHtsCode} 
                              isCheckedAttachedFile={this.props.isCheckedAttachedFile} 
                            />;
        } else {
            modalContent = null;
        }
        return(
            <div className="grid-wrapper">
                {modalContent}
            </div>
        )
    }

}

export default ModalMain;