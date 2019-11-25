import React, { Component } from 'react';
import { StyleSheet, View, ScrollView,Text  } from 'react-native';
import { TableWrapper,Table, Row, Rows,Col } from 'react-native-table-component';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK,FONT_REGULAR,BASE_URL
} from '../Helpers/Helper';
import NetInfo from "@react-native-community/netinfo";
import { getItemLocal } from '../Store/StoreLocal';
import Loader from '../Components/Loader';
import ErrorConnexion from '../Components/errorConnexion';

export default class Prochain extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tableHead: ['Date\nHeure', 'Départ\nArrivée', 'Prix', 'Carbone'],
          widthArr: [80, 120, 60, 100],
          widthArr1: [360],
          tableData:[],
          visible:false,
          isVisibleLoad:false,
          msg : ["Aucun trajet"],
          isConnect:true,
        }
      }
    componentWillMount() {
    	this.setState({isVisibleLoad:true});
    	NetInfo.isConnected.fetch().then( isConnected => {
            if(isConnected){
                this.setState({isConnect:true});
            	getItemLocal('id')
			      .then(res => {
			          console.log('id '+res);
			          this.setState({id: res},()=>{
			            this._fetchData();
			          });
			      });
            }else{
                this.setState({isConnect:false});
            	this.setState({isVisibleLoad:false});
            }	
        });
    }

    _fetchData(){
    	fetch(BASE_URL+'prochain',{
            method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  action: 'prochain',
                  id: this.state.id,
              }),
        })
        .then((response)=>response.json())
            .then((responseJson)=>{
                console.log(responseJson);
                if (responseJson.Error =='yes') {
                	this.setState({msg:[responseJson.msg]});
                	this.setState({tableData:[]});
                	this.setState({visible:true});
                }else{
                	this.setState({tableData:responseJson});
                	this.setState({visible:false});
                }
                this.setState({isVisibleLoad:false});
            })
            .catch((err)=>{
                console.log(err);
                this.setState({isVisibleLoad:false});
            }) 
    }
     
      render() {
        const state = this.state;
        
     
        return (
          <View style={styles.container}>
            <Text style={styles.texttop}>Vos prochains trajets</Text>
            
            	{!this.state.isConnect ? <ErrorConnexion/> : null}
              <View style={{flex:1,paddingBottom:55}}>
                <Table >
                  <Row 
                    data={state.tableHead} 
                    flexArr={[1, 2, 1, 1]}
                    textStyle={
                        {textAlign: 'center',color:COLOR_WHITE,fontFamily:FONT_REGULAR,}
                        } 
                    style={styles.header} 

                    />
                
                  {
                  	state.visible  
  	                ?	(
  	                		<TableWrapper >
  			                    <Row 
  				                    data={state.msg} 
  				                    flexArr={[1]} 
  				                    textStyle={
  				                        {textAlign: 'center',color:COLOR_BLACK,fontFamily:FONT_REGULAR,}
  				                        } 
  				                    style={styles.footer} 

  			                    />
  			                </TableWrapper>
  	                	) 
  	                :   (
  	                		<ScrollView style={styles.dataWrapper}>
  			                  <TableWrapper >
  			                    {
  			                      state.tableData.map((rowData, index) => (
  			                        <Row
  			                          key={index}
  			                          data={rowData}
  			                          flexArr={[1, 2, 1, 1]}
  			                          style={[styles.row]}
  			                          textStyle={styles.text}
  			                        />
  			                      ))
  			                    }
  			                  </TableWrapper>
  			                  
  			                </ScrollView>
  	                	)   
                  }
                </Table>
		          {this.state.isVisibleLoad ? <Loader style="ChasingDots"/> : null}  
              </View>
          </View>
        )
      }
    }
     
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 3, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: COLOR_GREEN },
    footer: { height: 50, backgroundColor: "#F7F6E7"},
    text: { 
        textAlign: 'center', 
        fontFamily:FONT_REGULAR,
        fontSize:11,
    },
    dataWrapper: { marginTop: -1 },
    row: { backgroundColor: COLOR_WHITE,margin: 2
 },
    texttop:{
        marginTop:5,
        marginBottom:5,
        alignSelf:'center',
        fontSize:18,
        color:COLOR_BLACK,
        fontFamily:FONT_REGULAR
    }
});