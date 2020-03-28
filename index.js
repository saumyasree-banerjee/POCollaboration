import React, { Component } from 'react';
import { withRouter, BrowserRouter as Link, Prompt } from 'react-router-dom';
import ModalMain from './modal.js';
import RequestRevision from './requestRevision.js';
import SaveSubmit from './saveSubmit.js';
import History from './history.js';
import Loader from '../Common/Loader';
import ModalError from '../Common/Error';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {Env,Environment} from '../../../Environment';
import PurchaseOrdersDetailsDummyJson from '../../../Data/PurchaseOrderDetails.js';
import FetchApi from '../../../Library/FetchApi.js'
import ReactTable from 'react-table'
import 'react-table/react-table.css'



class PurchaseOrderDetails extends Component {
  constructor(props){
    super(props);
    this.onUnload = this.onUnload.bind(this);
    this.state={
      userDataForApiHeader: { 
            name: this.props.dataSendToApiHeader.name,
            email: this.props.dataSendToApiHeader.email,
            userType: this.props.dataSendToApiHeader.userType,
            defaultBeCode: this.props.dataSendToApiHeader.defaultBeCode,
            otherBeCodes: (this.props.dataSendToApiHeader.otherBeCodes)? this.props.dataSendToApiHeader.otherBeCodes.join(","):null,
            organizationName:this.props.dataSendToApiHeader.organizationName,
            applicationName:this.props.dataSendToApiHeader.applicationName,
      },
      loader:false,
      modalerror:false,
      modalerrorMSG:"Unexpected error occured! Please try after some time.",
      historyData:[],
      requestData:[],
      setReasonForMessage:[],
      visibilityRequestRevision:false,
      filename: '',
      startDateFrom: null,
      jsonData:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetailsDefault,
      purchaseTableContent:[], //PurchaseOrdersDetailsDummyJson.PurchaseOrderDetailsDefault.Po.PoLines
      purchaseTableContentEdit:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetailsDefault.Po.PoLines,
      poStatus:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetailsDefault.Po.Status,
      modal:false,
      modalType:'', //singleModal, doubleModal 
      modalNegotiation:this.props.supplier, // Consinee, 
      modalContent:'',
      modalInd:'',
      nagotiation:'',
      readOnlyModal: false,
      errorSave:false,

      isCheckedStart_Date:false,  
      isCheckedEnd_Date:false,
      isCheckedQuantity:false,
      isCheckedPrice:false,
      isCheckedIncoterms:false,
      isCheckedUnit:false,
      isCheckedHtsCode:false,
      isCheckedAttachedFile:false,
      modalPoID: '',    
      modalPoLineID: '',

      
      ProposedValuesPoLineIdForEdit:'',
      ProposedValuesStart_DateForEdit: '',
      ProposedValuesEnd_DateForEdit:'',
      ProposedValuesQuantityForEdit: '',
      ProposedValuesPriceForEdit: '',
      ProposedValuesIncotermsForEdit: '',
      ProposedValuesUnitForEdit: '',
      ProposedValuesHtsCodeForEdit: '',
      ProposedValuesAttachedFileForEdit: '',
      

      visibilitySaveSubmit:false,
      user:null,
      windowElert:false,
      isBlocking: false,
      isPoLineRequestRevision: false,

      tablePoData:[ ],
      data:[],
      sortable: true,
      columns: [],
      isSelectable: true,
      selected: [],
      selectAll: 0,
    }
  }

  componentWillMount = () => {
    this.setState({ loader:true, user:this.props.userData });
    this.getHistoryData();
  }

  componentDidMount = () => {
      let self = this;
      window.addEventListener('beforeunload', this.onUnload);
      if(Env === "test"){
        this.setState({ 
              loader:false,
              jsonData: PurchaseOrdersDetailsDummyJson.PurchaseOrderDetails,
              poStatus:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetails.Po.Status,
              purchaseTableContent:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetails.Po.PoLines,
              purchaseTableContentEdit:PurchaseOrdersDetailsDummyJson.PurchaseOrderDetails.Po.PoLines,
        },()=>self.createTableForDetails());
        return false;
      }
      this.poDetailsFech();
      this.setColumnForReactTable()
  }

  componentWillUnmount = () => {
    clearInterval(this.setCountCancel);
    clearInterval(this.setCountAccept);
    clearInterval(this.setCountDeclined);
    window.removeEventListener('beforeunload', this.onUnload);
  } 

  signOut = () => {
      this.props.signOut();
  }

  
  /**
    * Browser event prvention
    *
    * When user change any data user promt this before close, refresh, redirec etc
    * 
  */
  onUnload = (event) => {
      if(this.state.isBlocking){
        event.returnValue = "Changes you made may not be saved.";
      }
  }

  /**
    * History data fetch on loading 
    *
    * 
    * 
  */
  getHistoryData = () =>{
    let self = this;
    if(Env === "test"){
        self.setState({ 
            loader:false,
        });
        return false;
    }
    let url; 
    if(self.state.modalNegotiation === 'supplier'){
      url = Environment.path+'/supplier/po/negotiation/getallcomments?poid='+self.props.id+'&pagenum=1' //self.props.id;
    } else {
      url = Environment.path+'/consignee/po/negotiation/getallcomments?poid='+self.props.id+'&pagenum=1';
    }

    FetchApi.FetchApiGet(url, self.state.userDataForApiHeader , function(responseJson){
        if(responseJson === "error"){
          self.setState({ loader:false, modalerror:true });
          return false;
        } else if (responseJson === "logout"){
            self.signOut();
            return false;
        }
        
        self.setState({ 
            historyData: responseJson,
        });
    });
  }

  
  /**
    * React Table from design system 
    *
    * 
    * 
    */

   /**** React table Functinality ****/
  createTableForDetails = () =>{
    let self = this;
    let poDetailsTableForDS = [];
    if(this.state.purchaseTableContent.length >= 1){
      this.state.purchaseTableContent.forEach((val,ind) => {
        let tableObject = {};
        tableObject.Id = val.Id || null;
        tableObject.PoLineId = val.PoLineId || null;
        tableObject.Number = ind+1 || null;
        tableObject.SKU = val.Value.SKU.OldValue || null;
        tableObject.Description = val.Value.Description.OldValue || null;
        tableObject.Quantity_Original = val.Value.Quantity.OldValue || null;
        tableObject.Quantity_Revision = val.Value.Quantity.NewValue || null;
        tableObject.Price_Original = val.Value.Price.OldValue || null;
        tableObject.Price_Revision = val.Value.Price.NewValue || null;
        tableObject.Attachment = val.Attachments || []
        tableObject.Status =val.PoLineNegotiationStatus || null;
        poDetailsTableForDS.push(tableObject)
      });
      self.setState({tablePoData:poDetailsTableForDS},()=>self.setColumnForReactTable())
    }
  }

  setColumnForReactTable = () => {
     let storeColumn = [];
        if(this.state.tablePoData){
          this.state.tablePoData.forEach((val,ind) => {
              if(ind===0) {
                  let heading = Object.keys(this.state.tablePoData[0])
                  heading.forEach((v,i) => {
                      //console.log(i);
                      let heading = v.replace(/_/g,' ')
                      if(v === 'Id' || v === 'PoLineId') {
                          return false;
                      } if(v === 'Attachment') {
                         storeColumn.push({
                              "headerClassName" : 'data-table header',
                              "Header"  : (rowInfo) => this.getColumnHeader(rowInfo, heading),
                              "accessor" : v,
                              sortable: false,
                              "Cell": row => {
                                                        let attachIcon, attachments=row.original.Attachment;
                                                        if(attachments !== null) {
                                                            if(attachments.length>0){
                                                                attachIcon = <i className="fa fa-paperclip" aria-hidden="true" />;
                                                            } else {
                                                                attachIcon = null;
                                                            }
                                                        } else {
                                                          attachIcon=null;
                                                        }
                                                        return attachIcon
                                                    },
                          })
                      } else if(v === 'Purchase_order_number' || v === 'Number') {
                        //if(this.props.supplier=== 'damco') {
                            //console.log("aaaa");
                            storeColumn.push({
                              "headerClassName" : 'data-table header',
                              "Header"  : (rowInfo) => this.getColumnHeader(rowInfo, heading),
                              "accessor" : v,
                              sortable: false,
                              "Cell": row => {
                                                        let nagotiation = this.state.modalNegotiation, poStatus = this.state.poStatus;
                                                        return (
                                                          <span><a href="" role="button" onClick={ (e)=> this.showModalForNagotiate(e, poStatus, nagotiation, row.original.Status, row.original.PoLineId, row.original.Number) }>{row.value}</a></span>
                                                      )
                                                    },
                              })
                      } else if(v === 'Status') {
                            //console.log("bbbb");
                            storeColumn.push({
                              "headerClassName" : 'data-table header',
                              "Header"  : (rowInfo) => this.getColumnHeader(rowInfo, heading),
                              "accessor" : v,
                              "Cell": row => this.getStatusRow(row.value),
                              sortable: false,
                            })
                      } else {
                            //console.log("cccc");
                            storeColumn.push({
                              headerClassName : 'data-table header',
                              Header  : (rowInfo) => this.getColumnHeader(rowInfo, heading),
                              accessor : v,
                              sortable: false,
                            })
                      }
                  })
              }
          });
          this.setState({
              columns: storeColumn
          })
        } else {
          storeColumn.push({
                            "headerClassName" : 'data-table header',
                            "Header"  : "No Header",
                            "accessor" : "Blank"
          })
          this.setState({
              columns: storeColumn
          })
        }
        /*this.state.tablePoData.forEach((val,ind) => {
          let heading = Object.keys(this.state.tablePoData[0])
                  heading.forEach((v,i) => {
                    storeColumn.push({
                              "headerClassName" : 'data-table header',
                              "Header"  : (rowInfo) => this.getColumnHeader(rowInfo, heading),
                              "accessor" : v,
                              "Cell": row => this.getStatusRow(row.value),
                              sortable: false,
                    })
                  });
          
        });*/
        /*this.setState({
              columns: storeColumn
        })*/
  }

  getStatusRow = (statusValue) =>{
        switch(statusValue){
                case'Processing':
                return <span><i className="fa fa-clock-o pending" aria-hidden="true"></i>{statusValue}</span>
                case'Processing successful':
                return <span><i className="fa fa-check-circle success" aria-hidden="true"></i>{statusValue}</span>
                
                case'Processing failed':
                return <span><i className="fa fa-times-circle cancelled" aria-hidden="true"></i>{statusValue}</span>
                
                case'Pending':
                return <span><i className="fa fa-clock-o pending" aria-hidden="true"></i>{statusValue}</span>
                
                case'Revision requested':
                return <span><i className="fa fa-pencil requested" aria-hidden="true"></i>{statusValue}</span>
                
                case'Requested change':
                return <span><i className="fa fa-pencil requested" aria-hidden="true"></i>{statusValue}</span>
                
                case'Revised':
                return <span><i className="fa fa-pencil revised" aria-hidden="true"></i>{statusValue}</span>
                
                case'Accepted':
                return <span><i className="fa fa-thumbs-up accepted" aria-hidden="true"></i>{statusValue}</span>
                
                case'Declined':
                return <span><i className="fa fa-thumbs-down declined" aria-hidden="true"></i>{statusValue}</span>
                 
                case'Cancelled':
                return <span><i className="fa fa-times-circle cancelled" aria-hidden="true"></i>{statusValue}</span>
                case'Complete':
                return <span><i className="fa fa-check-circle success" aria-hidden="true"></i>{statusValue}</span>
                
                case'Confirmed':
                return <span><i className="fa fa-thumbs-up success" aria-hidden="true"></i>{statusValue}</span>
                
                default:
                return <span>{statusValue}</span>
                
        }
  }

  getColumnHeader = (rowInfo,headerTxt) => {
          return (
              <div style={{display: 'inline'}}>
                  <span>{headerTxt}</span>
                  <i className="fa fa-sort" aria-hidden="true"/>
              </div>
          )
  };

  /**** React table Functinality close ****/

  /**
    * Po details data on load
    *
    * 
    * 
  */
  poDetailsFech = () =>{
    let self = this;
    let url; 
      if(this.state.modalNegotiation === 'supplier'){
        url = Environment.path+'/supplier/po/getbyid?poid='+this.props.id+'&sIndex=1&eIndex=1000'+Environment.type;
      } else {
        url = Environment.path+'/consignee/po/getbyid?poid='+this.props.id+'&sIndex=1&eIndex=1000'+Environment.type;
      }

      FetchApi.FetchApiGet(url, this.state.userDataForApiHeader , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          self.setState({ 
              loader:false,
              jsonData: responseJson,
              poStatus:responseJson.Po.Status,
              purchaseTableContent:responseJson.Po.PoLines,
              purchaseTableContentEdit:responseJson.Po.PoLines,
          },()=>self.createTableForDetails());
          for(var item = 0; item<responseJson.Po.PoLines.length; item++) {
               if(responseJson.Po.PoLines[item].PoLineNegotiationStatus === "Revision requested"){
                  self.setState({"isPoLineRequestRevision":true}); 
                  break;
               } 
          }
      });
  }

  /**
    * Nagotiation Modal
    *
    * user can change the value for old value new value
    * 
  */
  showModalForNagotiate = (e, poStatus, nagotiation, polineStatus, poLineID, index) => {
    e.preventDefault();
    this.setState({ loader:true });
    console.log(poStatus)
    console.log(nagotiation)
    console.log(polineStatus)
    console.log(poLineID)
    let self = this;
    if(Env === "test"){
        if((poStatus === "Pending" || poStatus === null) && nagotiation === 'consignee' &&  polineStatus === null ){
            this.setState({ 
              modalType:"singleModal",
              readOnlyModal: false,
              modalContent:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation,
              ProposedValuesAttachedFileForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Attachments.map((vl,i) => {
                return vl;
              }),
              modalInd:index,
              loader:false,
            },() => {
                  self.setState({modal:true});
            });
        } else if((poStatus === "Pending" || poStatus === null) && nagotiation === 'consignee' &&  polineStatus === "Revision requested" ){
            this.setState({
              modalType:"doubleModal",
              readOnlyModal: false,
              modalContent:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation,
              modalInd:index,
              loader:false,
              nagotiation:nagotiation,
              ProposedValuesPoLineIdForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.PoLineId,
              ProposedValuesStart_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Start_Date.NewValue,
              ProposedValuesEnd_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.End_Date.NewValue,
              ProposedValuesQuantityForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Quantity.NewValue,
              ProposedValuesPriceForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Price.NewValue,
              ProposedValuesIncotermsForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Incoterms.NewValue,
              ProposedValuesUnitForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Unit.NewValue,
              ProposedValuesHtsCodeForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.HtsCode.NewValue,
              ProposedValuesAttachedFileForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Attachments.map((vl,i) => {
                return vl;
              }),
            },() => {
              self.setState({modal:true});
            });
        } else if((poStatus === "Pending" || poStatus === null) && nagotiation === 'supplier' &&  (polineStatus === null || polineStatus === "Revision requested") ){
            this.setState({
              modalType:"doubleModal",
              readOnlyModal: false,
              modalContent:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation,
              modalInd:index,
              loader:false,
              nagotiation:nagotiation,
              ProposedValuesPoLineIdForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.PoLineId,
              ProposedValuesStart_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Start_Date.NewValue,
              ProposedValuesEnd_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.End_Date.NewValue,
              ProposedValuesQuantityForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Quantity.NewValue,
              ProposedValuesPriceForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Price.NewValue,
              ProposedValuesIncotermsForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Incoterms.NewValue,
              ProposedValuesUnitForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Unit.NewValue,
              ProposedValuesHtsCodeForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.HtsCode.NewValue,
              ProposedValuesAttachedFileForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Attachments.map((vl,i) => {
                return vl;
              }),
            },() => {
              self.setState({modal:true});
            });
        } else if((poStatus === "Pending" || poStatus === null) && nagotiation === 'supplier' &&  (polineStatus === null || polineStatus === "Revised") ){
            this.setState({
              modalType:"doubleModal",
              readOnlyModal: true,
              modalContent:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation,
              modalInd:index,
              loader:false,
              nagotiation:nagotiation,
              ProposedValuesPoLineIdForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.PoLineId,
              ProposedValuesStart_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Start_Date.NewValue,
              ProposedValuesEnd_DateForEdit:PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.End_Date.NewValue,
              ProposedValuesQuantityForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Quantity.NewValue,
              ProposedValuesPriceForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Price.NewValue,
              ProposedValuesIncotermsForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Incoterms.NewValue,
              ProposedValuesUnitForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.Unit.NewValue,
              ProposedValuesHtsCodeForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Value.HtsCode.NewValue,
              ProposedValuesAttachedFileForEdit: PurchaseOrdersDetailsDummyJson.modalPurchaseOrderDetailsNagotiation.Attachments.map((vl,i) => {
                return vl;
              }),
            },() => {
              self.setState({modal:true});
            });
        }

        return false;
    }
    
    let url;
    if( nagotiation === 'consignee'){
      url = Environment.path+'/consignee/po/poline/negotiation/getbyid?id=' + poLineID;
    } else {
      url = Environment.path+'/supplier/po/poline/negotiation/getbyid?id=' + poLineID;
    }

    FetchApi.FetchApiGet(url, this.state.userDataForApiHeader , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          if(nagotiation === 'consignee' && poStatus === "Pending"){
              self.revisionModal("singleModal",true,responseJson,index,nagotiation, poLineID);
          } else if(nagotiation === 'consignee' && poStatus === "Revision requested"){
              self.revisionModal("doubleModal",false,responseJson,index,nagotiation, poLineID);
          } else if(nagotiation === 'consignee' && (poStatus === "Revised" || poStatus === "Declined" || poStatus === "Cancelled" || poStatus === "Accepted")){
              self.revisionModal("doubleModal",true,responseJson,index,nagotiation, poLineID);
          } else if(nagotiation === 'supplier' && poStatus === "Revision requested"  && (polineStatus === "Revised" || polineStatus === "Revision requested") ){
            self.revisionModal("doubleModal",true,responseJson,index,nagotiation, poLineID);
          } else if(nagotiation === 'supplier' && (poStatus === "Declined" || poStatus === "Cancelled" || poStatus === "Accepted" || poStatus === "Revision requested" ) ){
              self.revisionModal("doubleModal",true,responseJson,index,nagotiation, poLineID);
          } else if(nagotiation === 'supplier' && (poStatus === "Pending" || poStatus === "Revised" )){
              self.revisionModal("doubleModal",false,responseJson,index,nagotiation, poLineID);
          } 

    });
  }


  /**
    * Nagotiation Modal conditionally display calling from showModalForNagotiate()
    *
    * 
    * 
  */
  revisionModal = (modalType,readOnlyModal,responseJson,index,nagotiation, poLineID) => {
    let self = this;
    if(modalType === "singleModal"){
        self.setState({
          loader:false,
          modalType:modalType,
          readOnlyModal: true,
          modalContent:responseJson,
          nagotiation:nagotiation,
          modalPoID: this.props.id,   
          modalPoLineID:poLineID,
          modalInd:index,
          ProposedValuesAttachedFileForEdit: responseJson.Attachments.map((vl,i) => {
            return vl;
          }),
        },() => {
          self.setState({modal:true});
        });
    } else {
        self.setState({
          loader:false,
          modalType:modalType,
          readOnlyModal: readOnlyModal,
          modalContent:responseJson,
          modalInd:index,
          nagotiation:nagotiation,
          modalPoID: this.props.id,   
          modalPoLineID:poLineID,
          ProposedValuesPoLineIdForEdit:responseJson.PoLineId,
          ProposedValuesStart_DateForEdit:responseJson.Value.Start_Date.NewValue,
          ProposedValuesEnd_DateForEdit:responseJson.Value.End_Date.NewValue,
          ProposedValuesQuantityForEdit: responseJson.Value.Quantity.NewValue,
          ProposedValuesPriceForEdit: responseJson.Value.Price.NewValue,
          ProposedValuesIncotermsForEdit: responseJson.Value.Incoterms.NewValue,
          ProposedValuesUnitForEdit: responseJson.Value.Unit.NewValue,
          ProposedValuesHtsCodeForEdit: responseJson.Value.HtsCode.NewValue,
          ProposedValuesAttachedFileForEdit: responseJson.Attachments.map((vl,i) => {
            return vl;
          }),
        },() => {
          self.setState({modal:true});
        });
    }
  }

  /**
    * Hide nagotiation modal
    *
    * When user click on close button from modal
    * 
  */
  hideModal = (resetData) => {
    this.cancelModal(resetData);
  }
  

  /**
    * for hideModal()
    *
    * 
    * 
  */
  cancelModal = (resetData) => {
    if(resetData==='undefined'){
        this.setState({
          modal:false,
        });
    }
    this.setState({
        isCheckedStart_Date:false,  
        isCheckedEnd_Date:false,
        isCheckedQuantity:false,
        isCheckedPrice:false,
        isCheckedIncoterms:false,
        isCheckedUnit:false,
        isCheckedHtsCode:false,
        isCheckedAttachedFile:false,
        ProposedValuesPoLineIdForEdit:resetData.ResetValuesPoLineIdForEdit,
        ProposedValuesStart_DateForEdit:resetData.ResetValuesStart_DateForEdit,
        ProposedValuesEnd_DateForEdit:resetData.ResetValuesEnd_DateForEdit,
        ProposedValuesQuantityForEdit: resetData.ResetValuesQuantityForEdit,
        ProposedValuesPriceForEdit: resetData.ResetValuesPriceForEdit,
        ProposedValuesIncotermsForEdit: resetData.ResetValuesIncotermsForEdit,
        ProposedValuesUnitForEdit: resetData.ResetValuesUnitForEdit,
        ProposedValuesHtsCodeForEdit: resetData.ResetValuesHtsCodeForEdit,
        //ProposedValuesAttachedFileForEdit: resetData.ResetValuesAttachedFileForEdit,

        ProposedValuesPoLineIdForEditError:'',
        ProposedValuesStart_DateForEditError:'',
        ProposedValuesEnd_DateForEditError:'',
        ProposedValuesQuantityForEditError:'',
        ProposedValuesPriceForEditError:'',
        ProposedValuesIncotermsForEditError:'',
        ProposedValuesUnitForEditError:'',
        ProposedValuesHtsCodeForEditError:'',
        ProposedValuesAttachedFileForEditError:'',
        modal:false,
    });
  }

  /**
    * save nagotiation modal
    *
    * When user click on save button from nagotiation modal
    * 
  */

  saveModal = (nagotiation, poStatus, poLineId, saveObj, attachmentArray) => {
    let self = this;
    this.setState({ loader:true });
    if(Env === "test"){
        let updateObj = saveObj;
        updateObj.Value.Start_Date.NewValue = moment(this.state.ProposedValuesStart_DateForEdit).format('l');
        updateObj.Value.End_Date.NewValue = moment(this.state.ProposedValuesEnd_DateForEdit).format('l');
        updateObj.Value.Quantity.NewValue = this.state.ProposedValuesQuantityForEdit;
        updateObj.Value.Price.NewValue = this.state.ProposedValuesPriceForEdit;
        updateObj.Value.Incoterms.NewValue = this.state.ProposedValuesIncotermsForEdit;
        updateObj.Value.Unit.NewValue = this.state.ProposedValuesUnitForEdit;
        updateObj.Value.HtsCode.NewValue = this.state.ProposedValuesHtsCodeForEdit;
        updateObj.attachments = this.state.ProposedValuesAttachedFileForEdit;

        let updateConsignee = this.state.purchaseTableContentEdit;
        let findInd, findRevision, updatedObj = {};
        for (let ind in updateConsignee){
          if(updateConsignee[ind].PoLineId === poLineId ){
              findInd = ind;
              findRevision = updateConsignee[ind];
          }
        }

        updatedObj = Object.assign({}, findRevision);
        updatedObj.PoLineNegotiationStatus="Revised";
        updateConsignee[findInd] = updatedObj;
        this.setState({
          isCheckedStart_Date:false,  
          isCheckedEnd_Date:false,
          isCheckedQuantity:false,
          isCheckedPrice:false,
          isCheckedIncoterms:false,
          isCheckedUnit:false,
          isCheckedHtsCode:false,
          isCheckedAttachedFile:false,
          purchaseTableContent:updateConsignee,
          purchaseTableContentEdit:updateConsignee,
          modal:false,
          isBlocking:true,
          isPoLineRequestRevision:true,
          loader:false,
        },()=>self.createTableForDetails());
        
        return false;
    }

    let updateObj = saveObj;
    updateObj.Value.Start_Date.NewValue = moment(this.state.ProposedValuesStart_DateForEdit).format('l');
    updateObj.Value.End_Date.NewValue = moment(this.state.ProposedValuesEnd_DateForEdit).format('l');
    updateObj.Value.Quantity.NewValue = this.state.ProposedValuesQuantityForEdit;
    updateObj.Value.Price.NewValue = this.state.ProposedValuesPriceForEdit;
    updateObj.Value.Incoterms.NewValue = this.state.ProposedValuesIncotermsForEdit;
    updateObj.Value.Unit.NewValue = this.state.ProposedValuesUnitForEdit;
    updateObj.Value.HtsCode.NewValue = this.state.ProposedValuesHtsCodeForEdit;
    updateObj.Attachments = this.state.ProposedValuesAttachedFileForEdit;

    let url;
    if( nagotiation === 'consignee'){
      url = Environment.path+'/consignee/po/poline/negotiation/revise ';
    } else {
      url = Environment.path+'/supplier/po/poline/negotiation/revise';
    }

    let userdata = Object.assign({}, this.state.userDataForApiHeader);
    userdata.poLineId= poLineId;
     
    FetchApi.FetchApiPost(url, userdata , JSON.stringify(updateObj) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }

          if(responseJson.StatusCode === 'Accepted'){
              let updatepurchaseTableContent = self.state.purchaseTableContentEdit;
              let findInd, findRevision, updatedObj = {};
              for (let ind in updatepurchaseTableContent){
                if(updatepurchaseTableContent[ind].PoLineId === poLineId ){
                    findInd = ind;
                    findRevision = updatepurchaseTableContent[ind];
                }
              }
              updatedObj = Object.assign({}, findRevision);
              if( nagotiation === 'consignee'){
                updatedObj.PoLineNegotiationStatus="Revised";
              } else {
                updatedObj.PoLineNegotiationStatus="Revision requested";
              }
              updatedObj.Attachments=attachmentArray;
              updatedObj.Value.Price.NewValue=updateObj.Value.Price.NewValue;
              updatedObj.Value.Quantity.NewValue=updateObj.Value.Quantity.NewValue;
              updatepurchaseTableContent[findInd] = updatedObj;
              self.setState({
                loader:false,
                isCheckedStart_Date:false,  
                isCheckedEnd_Date:false,
                isCheckedQuantity:false,
                isCheckedPrice:false,
                isCheckedIncoterms:false,
                isCheckedUnit:false,
                isCheckedHtsCode:false,
                isCheckedAttachedFile:false,
                purchaseTableContent:updatepurchaseTableContent,
                purchaseTableContentEdit:updatepurchaseTableContent,
                modal:false,
                isBlocking:true,
                isPoLineRequestRevision:true,
              },()=>self.createTableForDetails());
          }
         
    });
  }

  /**
    * In nagotiation modal input change two way data binding
    *
    * When user change input value this will change the state
    * 
  */
  handleChange = (e, name,value) => {
        let error = name+'Error';
        if(name === 'ProposedValuesQuantityForEdit' || name === 'ProposedValuesPriceForEdit') {
          let repDot, testValue, testValueCheck
          if(name === 'ProposedValuesPriceForEdit') {
            if(value.indexOf('.') >= 0) {
              //repDot = value.substr(0, value.indexOf('.'))
              repDot = value.replace(".", "")
            } else {
              repDot = value
            }
            testValue = /^.{0,18}$/
            testValueCheck = /^[0-9]+[.]{0,1}(\.[0-9]{1,6})?$/
          } else {
            if(value.indexOf('.') >= 0) {
              //repDot = value.substr(0, value.indexOf('.'))
              repDot = value.replace(".", "")
            } else {
              repDot = value
            }
            testValue = /^.{0,15}$/
            testValueCheck = /^[0-9]+[.]{0,1}(\.[0-9]{1,3})?$/
          }

          if(testValue.test(repDot)) {
            if(testValueCheck.test(value)) 
              this.setState({[error]: "", errorSave:false,});
            else {
              if(value === "") {
                if(name === 'ProposedValuesQuantityForEdit')
                  this.setState({[error]: "Enter a Quantity!", errorSave:true,});
                else
                  this.setState({[error]: "Enter a Price!", errorSave:true,});
              }
              else {
                this.setState({[error]: "Invalid Number!", errorSave:true,});                
              }
            }            
          } else {
              if(name === 'ProposedValuesQuantityForEdit')
                this.setState({[error]: "Total 15 digits allowed!", errorSave:true,})
              else
                this.setState({[error]: "Total 18 digits allowed!", errorSave:true,})
          }

          if(name === 'ProposedValuesQuantityForEdit') {
            if((value.indexOf('.') >= 0) && value.substr((value.indexOf(".")+1), value.length).length > 3) {
              this.setState({[error]: "Max 3 decimals allowed.", errorSave:true})
            }
          } else {
            if((value.indexOf('.') >= 0) && value.substr((value.indexOf(".")+1), value.length).length > 6){
              this.setState({[error]: "Max 6 decimals allowed.", errorSave:true})
            }
          }
        }
        if(name === 'ProposedValuesIncotermsForEdit') {
          if(/^.{0,50}$/.test(value)) {
            if(/^[ A-Za-z0-9.]*$/.test(value))
              this.setState({[error]: "", errorSave:false,})
            else
              this.setState({[error]: "Invalid character!", errorSave:true,})

            if(value === '')
              this.setState({[error]: "Cannot be empty!", errorSave:true,})
          }
          else
            this.setState({[error]: "Max 50 characters!", errorSave:true,})
        }

        if(name === 'ProposedValuesUnitForEdit') {
          if(/^.{0,10}$/.test(value)) {
            if(/^(?=[ A-Za-z0-9]*$)(?!.*[ ])/.test(value))
              this.setState({[error]: "", errorSave:false,})
            else
              this.setState({[error]: "Invalid character!", errorSave:true,})

            if(value === '')
              this.setState({[error]: "Unit cannot be empty!", errorSave:true,})
          }
          else
            this.setState({[error]: "Max 10 characters!", errorSave:true,})
        }

        this.setState({
            [name]: value,
        })  
  }


  /**
    * In nagotiation modal input change two way data binding
    *
    * When user change input value this will change the state
    * 
  */
  preventNumberInput = e => {
      let name = e.target.name,
          error = name +'Error'

      if(name === 'ProposedValuesQuantityForEdit' || name === 'ProposedValuesPriceForEdit') {
        if (e.which === 69) {
            e.preventDefault()
            this.setState({[error]: "Exponents not allowed!", errorSave:true,});
            setTimeout(() => this.setState({[error]: "", errorSave:false,}), 2000)
            return false;
        }
       }
  }


  /**
    * In nagotiation modal image upload 
    *
    * Attchments files
    * 
  */
  uploadFunc = (fileNamesDisplay, fileInput, modalPoID, modalPoLineID, nagotiation) => {
    this.setState({ProposedValuesAttachmentForEditError: ""})
    let fileLength = fileInput.files.length, i, 
        fileNames = [], fileNamesOnly = [], storeFileName = [], 
        extention = (fileInput.files[fileLength - 1].type).substr((fileInput.files[fileLength - 1].type).indexOf('/') + 1), 
        fileSize = (fileInput.files[fileLength - 1].size / 1024) / 1024, self = this
    
    if((extention === 'pdf' || extention === 'PDF' || extention === 'png' || extention === 'PNG' || extention === 'jpg' || extention === 'JPG' || extention === 'jpeg' || extention === 'JPEG' || extention === 'gif' || extention === 'GIF') && fileSize < 2) {
      let url;
      if( nagotiation === 'consignee'){
        url = Environment.path+'/consignee/po/poline/uploadAttachment'
      } else {
        url = Environment.path+'/supplier/po/poline/uploadAttachment'
      }
      if(fileNamesDisplay.length < 5) {
        let data = new FormData(), 
        header = {
          PoId: modalPoID,
          PoLineId: modalPoLineID,
          UploadedBy: this.state.userDataForApiHeader.name,
        }

        data.append('file', fileInput.files[0])
        this.setState({loader:true})

        FetchApi.FetchApiHeaderData(url, data , header, function(responseJson){ 
            if(responseJson === "error") {
              self.setState({loader:false})
              return false
            } else if (responseJson === "logout"){
              self.signOut();
              return false;
            }

            self.setState({loader:false})
            let responseJsonLen = responseJson.length - 1
            let fileLen = fileNamesDisplay.length
            if(fileLength < (6 - fileLen)) {
              fileNames = fileNamesDisplay
              for(i = 0; i < fileLength; i++) {
                fileNamesOnly[i] = responseJson[responseJsonLen].Name
              }
              storeFileName.push({
                  "Name" : responseJson[responseJsonLen].Name,
                  "Path"  : responseJson[responseJsonLen].Path,
                  "AttachmentId" : responseJson[responseJsonLen].AttachmentId
              });

              for(i = fileLen; i < (fileLen + fileLength); i++) {
                fileNames[i] = storeFileName[i-fileLen]
              }
              this.setState({ProposedValuesAttachedFileForEdit: fileNames})
            }
        })
      } else {
        this.setState({ProposedValuesAttachmentForEditError: "Max 5 files allowed!"})
        setTimeout(() => this.setState({ProposedValuesAttachmentForEditError: ""}), 2000)
      }
    } else {
        if(fileSize > 2) {
          this.setState({ProposedValuesAttachmentForEditError: "File too large!"})
          setTimeout(() => this.setState({ProposedValuesAttachmentForEditError: ""}), 2000)
        } else {
          this.setState({ProposedValuesAttachmentForEditError: "Incorrect format!"})
          setTimeout(() => this.setState({ProposedValuesAttachmentForEditError: ""}), 2000)          
        }
    }
  }

  /**
    * In nagotiation modal delete files
    *
    * Attchments delete func ( Not used in system but ready for future)
    * 
  */
  deleteFile = (e, inputFileElement, AttachmentId, nagotiation) => {
    
    let i, filename, url, self = this

    if( nagotiation === 'consignee'){
      url = Environment.path+'/consignee/po/poline/deleteAttachment'
    } else {
      url = Environment.path+'/supplier/po/poline/deleteAttachment'
    }

    if(this.state.filename) {
      let deletFileInput = document.getElementById(e).innerText
      filename = this.state.filename

      if(Env !== "test") {
        let data = new FormData()
        
        data.append('AttachmentId', AttachmentId)
        this.setState({loader:true})

        FetchApi.FetchApiDeleteData(url, data, function(responseJson){ 
          if(responseJson === "error") {
            self.setState({loader:false})
            return false
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }

          self.setState({loader:false})
          if(responseJson === '') {
            for(i = 0; i < filename.length; i++) {
              if(filename[i].Name === deletFileInput) {
                filename.splice(i, 1)
              }
            }
          }
        })        
      } else {
        for(i = 0; i < filename.length; i++) {
          if(filename[i].Name === deletFileInput) {
            filename.splice(i, 1)
          }
        }
      }

      this.setState({filename: filename}) 
    } else {
      let deletFileInput = document.getElementById(e[0]).innerText
      filename = e[1]

      if(Env !== "test") {
        let data = new FormData()
        
        data.append('AttachmentId', AttachmentId)
        this.setState({loader:true})

        FetchApi.FetchApiDeleteData(url, data, function(responseJson){ 
          if(responseJson === "error") {
            self.setState({loader:false})
            return false
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }

          self.setState({loader:false})
          if(responseJson === '') {
            for(i = 0; i < filename.length; i++) {
              if(filename[i].Name === deletFileInput) {
                filename.splice(i, 1)
              }
            }
          }
        })        
      } else {
        for(i = 0; i < filename.length; i++) {
          if(filename[i].Name === deletFileInput) {
            filename.splice(i, 1)
          }
        }
      }
    }
  }


  /**
    * Calender events (To)
    *
    * 
    * 
  */
  handleChangeFrom = (date) => {
      this.setState({
        ProposedValuesStart_DateForEdit: date
      });
  }

  handleBlurFrom = (date) =>{
      this.setState({ProposedValuesStart_DateForEdit:date})
  }

  handleChangeTo = (date) => {
      this.setState({
        ProposedValuesEnd_DateForEdit: date
      });
  }

  handleBlurTo = (date) =>{
      this.setState({
        ProposedValuesEnd_DateForEdit: date
      });
  }


  /**
    * Checkbox trigger ( for edit )
    *
    * 
    * 
  */
  toggleInput = (name,value) => {
      this.setState({
              [name]: value,
      });
  }



  /**
    * Revision request modal show
    *
    * 
    * 
  */

  showRequestModal = (modalType) => {
    if(Env === "test"){
        this.setState({
              visibilityRequestRevision: true,
              requestData: PurchaseOrdersDetailsDummyJson.requestData,
        });
        return false;
    }
    let self = this, url;
    if(this.state.modalNegotiation === 'supplier'){
        url = Environment.path+'/supplier/revision/reasons/getallreasons';
    } else {
        url = Environment.path+'consignee/revision/reasons/getallreasons';
    }
    this.setState({loader:true});

    FetchApi.FetchApiGet(url, this.state.userDataForApiHeader , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          self.setState({ 
              loader:false,
              requestData: responseJson,
          },()=>{
            self.setState({
              visibilityRequestRevision: true,
            });
          });
    });
  }

  /**
    * Revision request modal hide
    *
    * 
    * 
  */
  hideRequestModal = () =>{
    this.setState({
      visibilityRequestRevision: false,
    })
  }


  /**
    * Revision request modal submit
    *
    * Submit request button click
    * 
  */
  submitRequestModal = (getReasonArray, textArea) => {
      let self = this;
      this.setState({loader:true});
      if(Env === "test"){
          self.hideRequestModal();
          self.setState({ 
                loader:false,
                isBlocking:false
          },()=>{
            if (typeof(Storage) !== "undefined") {
                sessionStorage.setItem("savePoId", self.state.jsonData.Po.Purchase_order_number);
                sessionStorage.setItem("saveType", "revision request");
            }
            self.props.history.push({
              pathname:'/Negotiation/Purchaseorder',
            });
             
          });
          
          return false;
      }
      
      
      let updatedObjClone = {
        "poId":this.state.jsonData.Po.ID || null,
        "User":{
          "name":this.state.user.name || null,
          "email":this.state.user.email || null,
          "image":this.state.user.image || null,
          "imagePath":"" || null,
          "userType":this.state.user.userType || null,
        },
        "date":null,
        "time":null,
        "reasons":getReasonArray || [],
        "status":null,
        "message":textArea || null
      }

    let url = Environment.path+'/supplier/po/negotiation/requestrevision';

    FetchApi.FetchApiPost(url, this.state.userDataForApiHeader , JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          self.hideRequestModal();
          self.setState({ 
                loader:false,
                isBlocking:false
          },()=>{
            if (typeof(Storage) !== "undefined") {
                sessionStorage.setItem("savePoId", self.state.jsonData.Po.Purchase_order_number);
                sessionStorage.setItem("saveType", "revision request");
            } 
            self.props.history.push({
              pathname:'/Negotiation/Purchaseorder',
            });
            
          });
     });
     this.hideRequestModal();
  }


  /**
    * History data submit
    *
    * 
    * 
  */
  submitMessage = (message) => {
      this.setState({loader:true});
      let updatedObjClone = {
        "poId":this.state.jsonData.Po.ID || null,
        "User":{
          "name":this.state.user.name || null,
          "email":this.state.user.email || null,
          "image":this.state.user.image || null,
          "imagePath":"",
          "userType":this.state.user.userType || null,
        },
        "date":null,
        "time":null,
        "reasons":[],
        "status":null,
        "message":message || null
      }
     let self=this, url;
     if(this.state.modalNegotiation === 'supplier'){
        url = Environment.path+'/supplier/po/negotiation/savecomments';
      } else {
        url = Environment.path+'/consignee/po/negotiation/savecomments';
      }

     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader, JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          self.getHistoryData();
          self.setState({loader:false});
    });
  }

 
  /**
    * Save functionality
    *
    * 
    * Save button click
  */
  savePO = () => {
    let self = this;
    self.setState({ loader:true });
    if(Env === "test"){
        self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'revision', '/Negotiation/Purchaseorder');
        
        return false;
    }
    
    
    let updatedObjClone = {
        "poId":this.state.jsonData.Po.ID || null,
        "User":{
          "name":this.state.user.name || null,
          "email":this.state.user.email || null,
          "image":this.state.user.image || null,
          "imagePath":"",
          "userType":this.state.user.userType || null,
        },
        date:null,
        time:null,
        reasons:[],
        status:'Revised',
        message: null
    };
     
     let url = Environment.path+'/consignee/po/negotiation/revise';

     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader, JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true, isBlocking:false, });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'revision', '/Negotiation/Purchaseorder');
     });
  }


  /**
    * Save functionality (Save & Submit modal)
    *
    * 
    * save button click
  */
  savePOSubmit = (val) => {
    let self = this;
    this.setState({ loader:true });
    if(Env === "test"){
        self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'revision', '/Negotiation/Purchaseorder');
        return false;
    }
    
    let updatedObjClone = {
        poId:this.state.jsonData.Po.ID || null,
        User:{
          name:this.state.user.name || null,
          email:this.state.user.email || null,
          image:this.state.user.image || null,
          imagePath: '',
          userType:this.state.user.userType || null,
        },
        date:null,
        time:null,
        reasons:[],
        status:'Revised',
        message: val || null
      };
     
     let url = Environment.path+'/consignee/po/negotiation/revise';

     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader , JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true, isBlocking:false, });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'revision', '/Negotiation/Purchaseorder');
     });
  }


  /**
    * Cancel functionality
    *
    * 
    * Cancel button click
  */
  cancelPO = () => {
     let self = this;
     self.setState({ loader:true });
     if(Env === "test"){
        self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'cancellation', '/Negotiation/Purchaseorder');
        return false;
    }
    
     let updatedObjClone = {
        poId:this.state.jsonData.Po.ID || null,
        User:{
          name:this.state.user.name || null,
          email:this.state.user.email || null,
          image:this.state.user.image || null,
          imagePath: '',
          userType:this.state.user.userType || null,
        },
        date:null,
        time:null,
        reasons:[],
        status:'Revised',
        message: null
      };
     
     let url = Environment.path+'/consignee/po/negotiation/cancel';
     let urlBrain = Environment.path+'/consignee/po/statusupdate/getbyid?id=' ;

     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader , JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true, isBlocking:false, });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          if(responseJson.StatusCode === 'OK'){
            let counter = 0;
            let lastCount = 12;
            self.setCountCancel = setInterval(function(){ 
              counter = counter+1; 
              FetchApi.FetchApiGet(urlBrain+responseJson.TransactionId, self.state.userDataForApiHeader , function(responseJson){
                if(responseJson.TransactionStatus === 'success' || responseJson.TransactionStatus === 'failed'){
                  clearInterval(self.setCountCancel);
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'cancellation', '/Negotiation/Purchaseorder');
                }
              });
              if (counter === lastCount){
                  clearInterval(self.setCountCancel);
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'cancellation', '/Negotiation/Purchaseorder');
              }
            }, 5000);
          } else {
                self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'cancellation', '/Negotiation/Purchaseorder');
          }
     });
  }


  /**
    * Accept functionality
    *
    * 
    * Accept button click
  */
  acceptPO = () => {
    let self = this;
     self.setState({ loader:true });
     if(Env === "test"){
        self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'accept', '/Negotiation/Purchaseorder');
        return false;
    }
    let updatedObjClone = {
        poId:this.state.jsonData.Po.ID || null,
        User:{
          name:this.state.user.name || null,
          email:this.state.user.email || null,
          image:this.state.user.image || null,
          imagePath: '' || null,
          userType:this.state.user.userType || null,
        },
        date:null,
        time:null,
        reasons:[],
        status:'Revised',
        message: null
      };
     
     let url = Environment.path+'/supplier/po/negotiation/accept';
     let urlBrain = Environment.path+'/supplier/po/statusupdate/getbyid?id=' ;


     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader , JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true, isBlocking:false, });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          if(responseJson.StatusCode === 'OK'){
            let counter = 0;
            let lastCount = 12;
            self.setCountAccept = setInterval(function(){ 
              counter = counter+1; 
              FetchApi.FetchApiGet(urlBrain+responseJson.TransactionId, self.state.userDataForApiHeader, function(responseJson){
                if(responseJson.TransactionStatus === 'success' || responseJson.TransactionStatus === 'failed'){
                  clearInterval(self.setCountAccept);
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'accept', '/Negotiation/Purchaseorder');
                }
              });
              if (counter === lastCount){
                clearInterval(self.setCountAccept);
                  self.setState({ 
                        loader:false,
                        isBlocking:false
                  },()=>{
                    if (typeof(Storage) !== "undefined") {
                        sessionStorage.setItem("savePoId", self.state.jsonData.Po.Purchase_order_number);
                        sessionStorage.setItem("saveType", "accept");
                    } 
                    self.props.history.push({
                      pathname:'/Negotiation/Purchaseorder',
                    });
                    
                  });
              }
            }, 5000);
          } else {
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'accept', '/Negotiation/Purchaseorder');
          }   
          
     });
  }

  /**
    * Declined functionality
    *
    * 
    * Declined button click
  */
  declinePO = () => {
    let self = this;
     self.setState({ loader:true });
     if(Env === "test"){
        self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'decline', '/Negotiation/Purchaseorder');
        return false;
    }

     let updatedObjClone = {
        poId:this.state.jsonData.Po.ID || null,
        User:{
          name:this.state.user.name || null,
          email:this.state.user.email || null,
          image:this.state.user.image || null,
          imagePath: '',
          userType:this.state.user.userType || null,
        },
        date:null,
        time:null,
        reasons:[],
        status:'Revised',
        message: null
      };
     
     let url = Environment.path+'/supplier/po/negotiation/decline';
     let urlBrain = Environment.path+'/supplier/po/statusupdate/getbyid?id=' ;

     FetchApi.FetchApiPost(url, this.state.userDataForApiHeader , JSON.stringify(updatedObjClone) , function(responseJson){
          if(responseJson === "error"){
            self.setState({ loader:false, modalerror:true });
            return false;
          } else if (responseJson === "logout"){
            self.signOut();
            return false;
          }
          
          if(responseJson.StatusCode === 'OK'){
            let counter = 0;
            let lastCount = 12;
            self.setCountDeclined = setInterval(function(){ 
              counter = counter+1; 
              FetchApi.FetchApiGet(urlBrain+responseJson.TransactionId, self.state.userDataForApiHeader , function(responseJson){
                if(responseJson.TransactionStatus === 'success' || responseJson.TransactionStatus === 'failed'){
                  clearInterval(self.setCountDeclined);
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'decline', '/Negotiation/Purchaseorder');
                }
              });
              if (counter === lastCount){
                  clearInterval(self.setCountDeclined);
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'decline', '/Negotiation/Purchaseorder');
              }
            }, 5000);
          } else {
                  self.navigatePoRoute(self.state.jsonData.Po.Purchase_order_number, 'decline', '/Negotiation/Purchaseorder');
          }
     });
  }

  
  /**
    * Route to purchase order
    *
    * 
    * Route setting for PO header change
  */
  navigatePoRoute = (poId, savetype, path) => {
    let self = this;
    self.setState({ 
              loader:false,
              isBlocking:false
        },()=>{
          if (typeof(Storage) !== "undefined") {
              sessionStorage.setItem("savePoId", poId);
              sessionStorage.setItem("saveType", savetype);
          } 
          self.props.history.push({
            pathname:path,
          });
          
    });
  }

  errorModalHide = () =>{
      this.setState({ modalerror:false });
  }

  /**
    * Save  & Submit modal show
    *
    * 
    * for po status "Revision requested" this will appear ( the modal will come without history data)
  */
  openSaveSubmit = () =>{
    this.setState({ visibilitySaveSubmit:true });
  }

  /**
    * Save  & Submit modal hide
    *
    * 
    * 
  */
  hideSaveSubmit = () =>{
    this.setState({ visibilitySaveSubmit:false });
  }

  sendSaveSubmit = (val) =>{
    this.savePOSubmit(val);
  }

  render() {
    const Button = withRouter(({ history }) => (
      <button
        type='button'
        className="button-large button-transparent back-btn"
        onClick={() => { history.push('/Negotiation/Purchaseorder') }}
      >
        <i className="fa fa-angle-left" aria-hidden="true"></i>
      </button>
    ))
    let poStatus= this.state.poStatus;
    let statusElement;
    let pagesize = (this.state.tablePoData)? this.state.tablePoData.length : 0;

    switch(poStatus){
      case'Pending':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-clock-o pending" aria-hidden="true" /></div>;
      break;
      case'Revision requested':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-pencil requested" aria-hidden="true" /></div>;
      break;
      case'Revised':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-pencil revised" aria-hidden="true" /></div>;
      break;
      case'Accepted':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-thumbs-up accepted" aria-hidden="true" /></div>;
      break;
      case'Declined':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-thumbs-down declined" aria-hidden="true" /></div>;
      break; 
      case'Cancelled':
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value={poStatus} readOnly /><i className="fa fa-times-circle cancelled" aria-hidden="true" /></div>;
      break;
      default:
      statusElement = <div className="input-icon"><input type="text" className="form-control" id="purchase_orders_details_header_status_input" value="" readOnly /></div>;
      break;
    }

    

    
    return (
       <div>
       <Prompt
                when={this.state.isBlocking}
                message={location =>
                  `Changes you made may not be saved.`
                }
              />
        <div className="header-group profile-template">
          <ul className="page-title-group">
            <li>
              <Button />
            </li>
            <li>
              <h1>Purchase order details</h1>
            </li>
          </ul>
          </div>
          <section className="search-wrapper">
            { 
                  this.state.modalNegotiation === 'supplier'
                  ?
                  <div className="grid-wrapper" id="purchase_orders_details_btns">
                    <div className="button-group">
                      { (this.state.jsonData.Po.Status === "Declined" || this.state.jsonData.Po.Status === "Cancelled" || this.state.jsonData.Po.Status === "Accepted")?
                      <div>
                        <button disabled type="button" className="button-large button-blue" id="purchase_orders_details_btns_accept_btn">Accept</button>
                        <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_revisionrequest_btn">Revision request</button>
                        <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_decline_btn">Decline</button>
                      </div>
                      :
                      <div>
                        {
                          (this.state.jsonData.Po.Status === "Revision requested") ?
                          <div>
                            <button disabled type="button" className="button-large button-blue" id="purchase_orders_details_btns_accept_btn" onClick={() => this.acceptPO()}>Accept</button>
                            <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_revisionrequest_btn" >Revision request</button>
                            <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_decline_btn" onClick={() => this.declinePO()}>Decline</button>
                          </div>
                          :
                          <div>
                            {
                              (this.state.isPoLineRequestRevision) ?
                              <button disabled type="button" className="button-large button-blue" id="purchase_orders_details_btns_accept_btn" onClick={() => this.acceptPO()}>Accept</button>
                              :
                              <button type="button" className="button-large button-blue" id="purchase_orders_details_btns_accept_btn" onClick={() => this.acceptPO()}>Accept</button>
                            }
                            {
                              (this.state.isPoLineRequestRevision && this.state.poStatus) ?
                              <button  type="button" className="button-large button-transparent" id="purchase_orders_details_btns_revisionrequest_btn" onClick={this.showRequestModal}>Revision request</button>
                              :
                              <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_revisionrequest_btn" onClick={this.showRequestModal}>Revision request</button>
                            }
                            
                            <button type="button" className="button-large button-transparent" id="purchase_orders_details_btns_decline_btn" onClick={() => this.declinePO()}>Decline</button>
                          </div>
                        }
                      </div>
                      }
                      
                    </div>
                  </div>
                  :
                  <div className="grid-wrapper" id="purchase_orders_details_btns">
                    <div className="button-group">
                      { ( this.state.jsonData.Po.Status === "Revised" || this.state.jsonData.Po.Status === "Pending" || this.state.jsonData.Po.Status === "Declined" || this.state.jsonData.Po.Status === "Cancelled" || this.state.jsonData.Po.Status === "Accepted")?
                        <button disabled type="button" className="button-large button-blue" id="purchase_orders_details_btns_save_btn" onClick={() => this.savePO()}>Save</button>
                      :
                        (this.state.jsonData.Po.Status === "Revision requested") ?
                        <button type="button" className="button-large button-blue" id="purchase_orders_details_btns_save_btn" onClick={() => this.openSaveSubmit()}>Save</button>
                        :
                        <button type="button" className="button-large button-blue" id="purchase_orders_details_btns_save_btn" onClick={() => this.savePO()}>Save</button>
                      }
                      {
                          (this.state.jsonData.Po.Status === "Cancelled") ?
                          <button disabled type="button" className="button-large button-transparent" id="purchase_orders_details_btns_cancel_btn">Cancel PO</button>
                          :
                          <button type="button" className="button-large button-transparent" id="purchase_orders_details_btns_cancel_btn" onClick={() => this.cancelPO()}>Cancel PO</button>
                      }
                    </div>
                  </div>
            }
            <div className="grid-wrapper">
              <div className="col-70">
                  <div className="grid-wrapper vertical-form" id="purchase_orders_details_header">
                    <h3 className="title-blue-underline">HEADER</h3>
                    <form>
                      <div className="grid-wrapper">
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Purchase order number</label>
                            <input type="text" className="form-control" id="purchase_orders_details_header_ponumber_input" value={this.state.jsonData.Po.Purchase_order_number || ''} readOnly/>
                          </div>
                        </div>
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Status</label>
                            {statusElement}
                          </div>
                        </div>
                      </div>
                      <div className="grid-wrapper">
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Purchase order type</label>
                            <input type="text" className="form-control" id="purchase_orders_details_header_potype_input" value={this.state.jsonData.Po.Purchase_order_type || ''} readOnly/>
                        </div>
                        </div>
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Contract number</label>
                            <input type="text" className="form-control" id="purchase_orders_details_header_contactno_input" value={this.state.jsonData.Po.Contract_number || ''} readOnly/>
                          </div>
                        </div>
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Earliest ship date</label>
                            <input type="text" className="form-control calendar-input hasDatepicker" id="purchase_orders_details_header_erlshipdate_input" name="EarliestShipDateFrom" placeholder="dd/mm/yyyy" value={this.state.jsonData.Po.Earliest_ship_date || ''} readOnly/>
                          </div>
                        </div>
                         
                      </div>
                      <div className="grid-wrapper">
                        <div className="col-30">
                          { 
                            this.state.modalNegotiation === 'supplier'
                            ?
                            <div className="form-group">
                              <label htmlFor="exampleInputPassword1">Consignee</label>
                              <input type="text" className="form-control" id="purchase_orders_details_header_consignee_input" value={this.state.jsonData.Po.Consignee || ''} readOnly/>
                            </div>
                            :
                            <div className="form-group">
                              <label htmlFor="exampleInputPassword1">Shipper</label>
                              <input type="text" className="form-control" id="purchase_orders_details_header_shipper_input" value={this.state.jsonData.Po.Shipper || ''}  readOnly/>
                            </div>
                          }
                        </div>
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Origin</label>
                            <input type="text" className="form-control" id="purchase_orders_details_header_origin_input" value={this.state.jsonData.Po.Origin || ''} readOnly/>
                          </div>
                        </div>
                        <div className="col-30">
                          <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Destination</label>
                            <input type="text" className="form-control" id="purchase_orders_details_header_destination_input" value={this.state.jsonData.Po.Destination || ''} readOnly/>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="grid-wrapper">
                    <h3 className="title-blue-underline">LINES</h3>
                    <div className="data-table-container">
                      <div className="result-section">
                        <div className="ReactTable data-table fixedHeaderForTable">
                          {(this.state.tablePoData.length>0)?
                          <ReactTable
                              data={this.state.tablePoData}
                              columns={this.state.columns}
                              showPagination={false}
                              sortable={this.state.sortable}
                              className={"data-table fixed-header"}
                              defaultPageSize={20}
                              minRows= {0}
                              style={{
                                  maxHeight: 400
                              }}
                              pageSize={pagesize}
                          /> :
                          <div className="message info"><i aria-hidden="true" className="fa fa-info-circle fa-3x"></i><span id="message_success">No data found</span></div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="col-30" id="purchase_orders_details_history">
                <h3 className="title-blue-underline">HISTORY</h3>
                <History dataSendToApiHeader={this.props.dataSendToApiHeader} submitMessage={this.submitMessage} historyData={this.state.historyData} />
              </div>
            </div>
          </section>
          <ModalMain 
            nagotiation={this.state.modalNegotiation} 
            readOnlyModal={this.state.readOnlyModal} 
            errorSave={this.state.errorSave} 
            handleChange={this.handleChange}  
            uploadFunc={this.uploadFunc} 
            deleteFile={this.deleteFile} 
            filename={this.state.filename}
            preventNumberInput={this.preventNumberInput} 
            handleChangeFrom={this.handleChangeFrom} 
            handleChangeTo={this.handleChangeTo} 
            handleBlurFrom={this.handleBlurFrom} 
            handleBlurTo={this.handleBlurTo} 
            cancelModal={this.cancelModal} 
            saveModal={this.saveModal}  
            modalContent={this.state.modalContent} 
            modalInd={this.state.modalInd}  
            poStatus={this.state.poStatus} 
            modalNegotiation={this.state.modalNegotiation} 
            title={"Select Shipper"} 
            btnTitle1={"Cancel"}                     
            btnTitle2={"Save"} 
            modal={this.state.modal} 
            hideModal={this.hideModal} 
            modalType={this.state.modalType} 
            modalPoID={this.props.id}     
            modalPoLineID={this.state.modalPoLineID} 
            ProposedValuesPoLineIdForEdit={this.state.ProposedValuesPoLineIdForEdit} 
            ProposedValuesPoLineIdForEditError={this.state.ProposedValuesPoLineIdForEditError} 
            ProposedValuesStart_DateForEdit={this.state.ProposedValuesStart_DateForEdit} 
            ProposedValuesStart_DateForEditError={this.state.ProposedValuesStart_DateForEditError} 
            ProposedValuesEnd_DateForEdit={this.state.ProposedValuesEnd_DateForEdit} 
            ProposedValuesEnd_DateForEditError={this.state.ProposedValuesEnd_DateForEditError} 
            ProposedValuesQuantityForEdit={this.state.ProposedValuesQuantityForEdit} 
            ProposedValuesQuantityForEditError={this.state.ProposedValuesQuantityForEditError} 
            ProposedValuesPriceForEdit={this.state.ProposedValuesPriceForEdit} 
            ProposedValuesPriceForEditError={this.state.ProposedValuesPriceForEditError} 
            ProposedValuesIncotermsForEdit={this.state.ProposedValuesIncotermsForEdit} 
            ProposedValuesIncotermsForEditError={this.state.ProposedValuesIncotermsForEditError} 
            ProposedValuesUnitForEdit={this.state.ProposedValuesUnitForEdit} 
            ProposedValuesUnitForEditError={this.state.ProposedValuesUnitForEditError}  
            ProposedValuesHtsCodeForEdit={this.state.ProposedValuesHtsCodeForEdit} 
            ProposedValuesHtsCodeForEditError={this.state.ProposedValuesHtsCodeForEditError} 
            ProposedValuesAttachedFileForEdit={this.state.ProposedValuesAttachedFileForEdit} 
            ProposedValuesAttachedFileForEditError={this.state.ProposedValuesAttachedFileForEditError} 
            ProposedValuesAttachmentForEditError={this.state.ProposedValuesAttachmentForEditError} 
            toggleInput={this.toggleInput} 
            isCheckedStart_Date={this.state.isCheckedStart_Date} 
            isCheckedEnd_Date={this.state.isCheckedEnd_Date} 
            isCheckedQuantity={this.state.isCheckedQuantity} 
            isCheckedPrice={this.state.isCheckedPrice} 
            isCheckedIncoterms={this.state.isCheckedIncoterms} 
            isCheckedUnit={this.state.isCheckedUnit}
            isCheckedLabelling={this.state.isCheckedLabelling} 
            isCheckedHtsCode={this.state.isCheckedHtsCode} 
            isCheckedAttachedFile={this.state.isCheckedAttachedFile}  
          />
          <Loader loader={this.state.loader} /> 
          <ModalError errorModalHide={this.errorModalHide} modalerror={this.state.modalerror} modalerrorMSG={this.state.modalerrorMSG} btnTitle2={"Ok"} />
          <RequestRevision requestData={this.state.requestData} submitRequestModal={this.submitRequestModal} visibilityRequestRevision={this.state.visibilityRequestRevision} hideRequestModal={this.hideRequestModal} />
          <SaveSubmit sendSaveSubmit={this.sendSaveSubmit} visibilitySaveSubmit={this.state.visibilitySaveSubmit} hideSaveSubmit={this.hideSaveSubmit} btnTitle1={"Cancel"} btnTitle2={"Save"} />
      </div>
    );
  }
}

export default withRouter(PurchaseOrderDetails);