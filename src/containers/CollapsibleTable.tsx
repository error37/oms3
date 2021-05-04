import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {IonCard, IonCardContent, IonContent, IonCardHeader, IonButton} from "@ionic/react";
import {LineItem, Order} from "./Order";
import axios from "axios";
import {format} from "date-fns-tz";
import {Date} from "prismic-reactjs";
import {Popover} from "@material-ui/core";
import {Customer} from "./Customer";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const usePopOverStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

const fetchInterval: number = 10000;
const customerServiceURL = `http://localhost/customers`;
const orderServiceURL = `http://localhost/orders`;

const custom = new Customer();
export function FetchCustomer(props: any) {
    const { id } = props;
    const [customer, getCustomer] = useState(custom);
    const url = customerServiceURL + '/' + id;

    useEffect(() => { getMyCustomer();}, []);

    const getMyCustomer = () => {
        axios.get(url).then(data => {
            const resultSet: Customer = data.data;
            if (resultSet !== undefined)
                getCustomer(resultSet);
        }).catch()
    }

    return(
        <DisplayCustomer customer={customer}/>
    )
}


export function DisplayCustomer(props: any) {
    const displayCustomer = (props: any) => {
        const {customer} = props;
        if (customer) {
            return (
                <Typography key={customer.id}>
                        {customer.salutation} {customer.firstName} {customer.lastName}<br/>
                        {customer.homeEmail}
                </Typography>
            )
        } else {
            return (<h2>Loading...</h2>)
        }
    }
    return (
        <>
            {displayCustomer(props)}
        </>
    )
}

function Row(props: any) {
    const order: Order = props.row;
    const caller: CollapsibleTable = props.caller;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const classesPopOverStyle = usePopOverStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handlePopoverOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const popOverOpen = Boolean(anchorEl);

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {order.id}
                </TableCell>
                <TableCell align="right">{format(Date(order.lastModified), 'MMMM dd, yyyy H:mm a')}</TableCell>
                <TableCell align="right">{order.channel}</TableCell>
                <TableCell align="right">
                    <div>
                        <Typography aria-owns={popOverOpen ? 'mouse-over-popover' : undefined} aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        >
                            {order.customerId}
                        </Typography>
                        <Popover
                            id="mouse-over-popover"
                            className={classesPopOverStyle.popover}
                            classes={{paper: classesPopOverStyle.paper,}}
                            open={popOverOpen}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <FetchCustomer id={order.customerId}/>
                        </Popover>
                    </div>
                </TableCell>
                <TableCell align="right">{order.transactionNetAmount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                Line items
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Sku #</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Tax Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.lineItem.map((line: LineItem) => (
                                        <TableRow key={line.id}>
                                            <TableCell component="th" scope="row">
                                                {line.description}
                                            </TableCell>
                                            <TableCell>{line.sku}</TableCell>
                                            <TableCell align="right">{line.extendedAmount}</TableCell>
                                            <TableCell align="right">
                                                {line.taxAmount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell/>
                <TableCell/>
                <TableCell/>
                <TableCell>
                    {order.status !== 'Processed' &&
                    <IonButton color={'light'} size={'small'}
                               onClick={() => {
                                   caller.processOrder(+order.id, caller.props.type);
                               }}
                    >
                        Process Order
                    </IonButton>
                    }</TableCell>
                <TableCell>
                    <IonButton color={'danger'} size={'small'}
                               onClick={() => {
                                   caller.deleteOrder(+order.id)
                               }}
                    >
                        Delete Order
                    </IonButton>
                </TableCell>
                <TableCell/>
            </TableRow>
        </React.Fragment>
    );
}

Row.propType = {
    row: PropTypes.instanceOf(Order)
}

type ListProps = {
    title: string;
    type: string;
}

type ListState = {
    orders: Order[];
    newOrders: Order[];
    inprocessOrders: Order[];
    processedOrders: Order[];
}


export default class CollapsibleTable extends React.Component<ListProps, ListState> {
    constructor(props: ListProps) {
        super(props);
        this.state = {orders: [], inprocessOrders: [], newOrders: [], processedOrders: []};
    }

    public deleteOrder(id: number) {
        const url = orderServiceURL + '/' + id;
        axios.delete(url).then(data => {
            const index = this.state.orders.findIndex(order => order.id === id + '');
            this.state.orders.splice(index, 1);
            console.log('Deleted order ' + id);
        }).then(() => this.fetchContent());
    }

    public processOrder(id: number, context: string) {
        let newStatus = 'In process';
        const url = orderServiceURL + '/' + id;
        if (context === 'inprocess') newStatus = 'Processed'; // user clicked on 'process order' button and order was 'In process' so now order is processed
        axios.patch(url, {status: newStatus}).then(data => {
            console.log('Processed order ' + id);
        }).then(() => this.fetchContent());
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
        axios.get(orderServiceURL ).then(data => {
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
                    <IonCardContent>
                        <div>
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell>Order #</TableCell>
                                            <TableCell align="right">Date</TableCell>
                                            <TableCell align="right">Origin</TableCell>
                                            <TableCell align="right">Customer ID</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <Row key={order.id} row={order} caller={this}/>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        );
    }
}