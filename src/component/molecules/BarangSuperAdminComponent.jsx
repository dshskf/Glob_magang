import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Col, Label, Badge } from 'reactstrap'
import NumberFormat from 'react-number-format';

const BarangSuperAdminComponent = (props) => {
    return(
        <Col xs="12" sm="12" md="3" className="product-card ">
            <Card style={{marginBottom:'10%'}}>
                <div style={{width:"50%", alignContent:"center", margin:"auto", marginTop:"5%"}}>
                    <CardImg src={props.data.foto} alt=""/>
                    <div style={{position: "absolute", top: "0", right: "0", marginTop:"3%"}}>
                        <Label>{props.data.status}</Label>
                    </div>
                </div>
                <CardBody>
                    <CardTitle>{props.data.nama}</CardTitle>
                    <CardText>
                            {/* <Badge color="warning" style={{fontWeight:"bold"}}> {props.data.price} </Badge> <NumberFormat value={Math.ceil(props.data.clear_price * props.kurs_now)}
                                displayType={'text'} style={{fontWeight:"bold"}} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {props.data.alias} */}

                            <Badge color="warning" style={{fontWeight:"bold"}}> {props.data.price} </Badge> <NumberFormat value={Math.ceil(props.data.clear_price * props.data.nominal)}
                                displayType={'text'} style={{fontWeight:"bold"}} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {props.data.alias}
                    </CardText>
                    <CardText>  
                        <small className="text-muted">Diperbarui: {props.data.update_date}</small>
                    </CardText>
                </CardBody>  
                <div style={{position: "absolute", bottom: "0", right: "0", marginBottom:"3%", marginRight:"3%"}}>
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-primary" onClick={()=> props.detail(props.data.id)}>Detail</button>
                </div>
            </Card>
        </Col>
    )
}

export default BarangSuperAdminComponent;