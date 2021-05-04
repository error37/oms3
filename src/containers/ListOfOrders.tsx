import React from 'react';
import {Order} from "./Order";
import {IonCard, IonCardContent, IonContent, IonCardHeader, IonButton, IonList, IonItem, IonLabel} from "@ionic/react";
import axios from 'axios';
import {Date} from 'prismic-reactjs';
import {format} from 'date-fns-tz'

type ListState = {
    orders: Order[];
    newOrders: Order[];
    inprocessOrders: Order[];
    processedOrders: Order[];
}

type ListProps = {
    title: string;
    type: string;
}

const fetchInterval: number = 10000;

export default class ListOfOrders extends React.Component<ListProps, ListState> {


    constructor(props: ListProps) {
        super(props);
        this.state = {orders: [], inprocessOrders: [], newOrders: [], processedOrders: []};
    }

    public componentDidMount(): void {
        this.fetchContent();
        try {
            setInterval(async () => {
                this.fetchContent();
            }, fetchInterval)
        } catch (e) {
            console.log('Error ' + e);
        }
    }

    private fetchContent() {
        axios.get(`http://localhost/orders`).then(data => {
            const resultSet: Order[] = data.data;
            this.updateState(resultSet);
            console.log('Loaded orders from Order service')
        }).catch()
    }

    private updateState(resultSet: Order[]) {
        let newOrders: Order[] = [];
        let inprocessOrders: Order[] = [];
        let processedOrders: Order[] = [];
        resultSet.forEach(function (order) {
            if (order.status === 'New') {
                newOrders.push(order);
            } else if (order.status === 'In process') {
                inprocessOrders.push(order);
            } else {
                processedOrders.push(order)
            }
        });
        this.setState(state => ({
            orders: resultSet,
            inprocessOrders: inprocessOrders,
            newOrders: newOrders,
            processedOrders: processedOrders
        }));
    }

    public deleteOrder(id: number) {
        axios.delete(`http://localhost/orders/${id}`).then(data => {
            const index = this.state.orders.findIndex(order => order.id === id + '');
            this.state.orders.splice(index, 1);
            console.log('Deleted order ' + id);
        }).then(() => this.fetchContent());
    }

    public processOrder(id: number, context: string) {
        let newStatus = 'In process';
        if (context === 'inprocess') newStatus = 'Processed'; // user clicked on 'process order' button and order was 'In process' so now order is processed
        axios.patch(`http://localhost/orders/${id}`, {status: newStatus}).then(data => {
            console.log('Processed order ' + id);
        }).then(() => this.fetchContent());
    }

    public render() {
        let orders: Order[] = [];
        if (this.props.type === 'new') orders = this.state.newOrders;
        if (this.props.type === 'inprocess') orders = this.state.inprocessOrders;
        if (this.props.type === 'processed') orders = this.state.processedOrders;
        return (
            <IonContent scrollEvents={true}
                        onIonScrollStart={_e => {
                            console.log(_e);
                        }}
                        onIonScroll={() => {
                        }}
                        onIonScrollEnd={() => {
                        }}>
                <IonCard>
                    <IonCardHeader>
                        <h1>{this.props.title}</h1>
                    </IonCardHeader>
                    <IonCardContent
                    >
                        <IonList>
                            {orders && orders.map(order =>
                                <IonItem key={order.id}>
                                    <IonLabel>
                                        <h2><b>Order
                                            #{order.id} </b>- {format(Date(order.lastModified), 'MMMM dd, yyyy H:mm a')} -
                                            Source: {order.channel} - Customer: {order.customerId} </h2>
                                        <h3 style={{marginLeft: "50px"}}>Balance
                                            due: {order.transactionBalanceDueAmount} -
                                            Amount: {order.transactionNetAmount}</h3>
                                        <div style={{marginLeft: "50px"}}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                {order.lineItem && order.lineItem.map(lineItem => <>
                                                    Line
                                                    item {lineItem.sequenceNumber}: {lineItem.description} @ {lineItem.extendedAmount}
                                                    <br/> </>
                                                )}
                                            </div>
                                            {order.status !== 'Processed' &&
                                            <IonButton color={'light'} size={'small'}
                                                       onClick={() => {
                                                           this.processOrder(+order.id, this.props.type);}}
                                            >
                                                Process Order
                                            </IonButton>
                                            }
                                            <IonButton color={'danger'} size={'small'}
                                                       onClick={() => {
                                                           this.deleteOrder(+order.id)}}
                                            >
                                                Delete Order
                                            </IonButton>

                                        </div>

                                    </IonLabel>
                                </IonItem>
                            )}
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        );
    }

}