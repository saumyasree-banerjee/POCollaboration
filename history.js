import React, { Component } from 'react';
import { DamcoLogo, DamcoAvatar } from '../../../Library/ImgUrlConfig';


class History extends Component {
	constructor(props){
		super(props)
		this.handleChange = this.handleChange.bind(this);
		this.state={
			value:'',
		}
	}
	handleChange(event) {
    	this.setState({value: event.target.value});
    }

    submitMessage = () => {
    	let value = this.state.value.trim();
    	if (value === ''){
    		return false;
    	} 
    	this.props.submitMessage(value);
    	this.setState({value: ''});

    }
	render(){
		let history = this.props.historyData;
		let historyContent = history.map((val,i) => {
			let reasonsData= history[i].reasons;
			let reasonsContent;
			if(reasonsData.length>0){
				let reasonsRows = reasonsData.map((val,i) => {
					let id = i;
					return (<p key={i} id={id}>-{val.reason}</p>);
				});
				reasonsContent = <div id="purchase_orders_details_history_contents_block_reasons"><p>Reasons:</p> {reasonsRows}</div>;
			} else {
				reasonsContent = null;
			}

			let messageData= history[i].message;
			let messageContent;
			if(messageData){
				messageContent = <div id="purchase_orders_details_history_contents_block_messages"><p>Message:</p> <p id="purchase_orders_details_history_contents_block_messages_cont">{messageData}</p></div>;
			} else {
				messageContent = null;
			}

			let statusData= history[i].status;
			let statusContent;
			if(statusData){
				statusContent = <div className={"status-msg"}><i className="fa fa-clock-o pending" aria-hidden="true"/><span>{statusData}</span></div>;
			} else {
				statusContent = null;
			}
			return (
				<li className={"timeline-history"} id="purchase_orders_details_history_contents_block" key={i}>
                    <div className={"image-block inline"}>
                        <img alt="userImage" src={history[i].User.imagePath} id="purchase_orders_details_history_contents_block_img" />
                    </div>
                    <div className={"info-block inline"}>
                        <div className={"info-head"}>
                            <span className={"title"} id="purchase_orders_details_history_contents_block_title">
                                {history[i].User.name}
                            </span>
                            <span className={"date-time"} id="purchase_orders_details_history_contents_block_datetime">
                                {history[i].date} {history[i].time}
                            </span>
                        </div>
                        <div className={"info-body"}>
                            {statusContent}
                            <div className={"message-container"}>
	                            {reasonsContent}
	                            {messageContent}
                            </div>
                        </div>
                    </div>
                </li>
			);
		});

		let userProfileImage = (this.props.dataSendToApiHeader.image) ? 'data:image/png;base64,'+ this.props.dataSendToApiHeader.image : DamcoAvatar;

		return(
			<div>
				<div className={"time-line-widget"}>
                    <ul className={"timeline-list"}>
                        <li className={"timeline-input"} id="purchase_orders_details_history_message">
                            <div className={"image-block inline"}>
                                <img alt="userImage" src={userProfileImage} id="purchase_orders_details_history_message_img"/>
                            </div>
                            <div className={"input-block inline"}>
                                <div className="input-btn-wrapper">
                                    <input className="form-control" type="text" value={this.state.value} onChange={this.handleChange} id="purchase_orders_details_history_message_input" maxLength="500" />
                                    <button type="button" className="select-btn" onClick={this.submitMessage} id="purchase_orders_details_history_message_submit">
                                        <span className="fa fa-paper-plane" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul className={"timeline-list"} id="purchase_orders_details_history_contents">
                        {historyContent}
                    </ul>
                </div>
			</div>
		)
	}
}

export default History;