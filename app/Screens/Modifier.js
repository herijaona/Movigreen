import React, { Component } from 'react';
import {  
    View,
    Text,
    StyleSheet,
    
} from 'react-native';
import Modal from 'react-native-modal';
import { 
    ListItem,
    Button
} from 'react-native-elements';
import Toast, {DURATION} from 'react-native-easy-toast'
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR_BLACK, COLOR_GREEN, FONT_REGULAR, COLOR_WHITE ,FONT_BOLD, COLOR_GRIS, COLOR_RED, BASE_URL} from '../Helpers/Helper';
import AsyncStorage from '@react-native-community/async-storage';
import { getItemLocal } from '../Store/StoreLocal';
import {FloatingLabelInput} from '../Components/FloatingLabelInput';
import Loader from '../Components/Loader';
import NetInfo from "@react-native-community/netinfo";

export default class Modifier extends Component{

    static navigationOptions = {
        title: 'Mes informations',
        headerStyle: { backgroundColor:COLOR_GREEN },
        headerTintColor: COLOR_WHITE,
        headerTitleStyle: { color: COLOR_WHITE,fontFamily:FONT_REGULAR,textAlign:'center' },
         
    }
    constructor(props){
        super(props);
        this.state={
            id:'',
            nom:'',
            prenom:'',
            email:'',
            phone:'',
            pswd:'',
            npswd:'',
            cnpswd:'',
            modalVisible:false,
            input:' ',
            type:'',
            disabled:true,
            nemail:'',
            nphone:'',
            show:false,
            msg:'',
            isVisibleLoad:false
        }
        getItemLocal('id')
        .then(res => {
            this.setState({id: res});
        });
    }
    UNSAFE_componentWillMount(){
        this.getAlldata();
    }
    componentDidMount() {
        
    }

    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value},()=>{
            if(this.state.type === 'mdp'){
                if(this.state.pswd !='' && this.state.npswd !='' && this.state.cnpswd !=''){
                    if(this.state.npswd != this.state.cnpswd){
                        this.setState({
                            disabled:true,
                            msg:"Les deux mot de passe sont differents",
                            show:true
                        })
                    }else{
                        this.setState({
                            disabled:false,
                            show:false
                        })
                    }
                        
                }else{
                    this.setState({
                        disabled:true,
                        msg:"Completez tous les champs vide",
                        show:true
                    })
                }
            }else if(this.state.type==='téléphone'){
                if((this.state.phone === this.state.nphone) || this.state.nphone==''){
                    this.setState({disabled:true})
                }else{
                    this.setState({
                        disabled:false,
                        show:false
                    })
                }
            }else{
                let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
                if((this.state.email === this.state.nemail) || this.state.nemail==''){
                    this.setState({disabled:true,show:false})
                }else if(regex.test(this.state.nemail)===false){
                    this.setState({
                        disabled:true,
                        msg:"Adresse email invalid",
                        show:true
                    })
                }
                else{
                    this.setState({
                        disabled:false,
                        show:false
                    })
                }
            }
        });
            
    }

    getAlldata(){
        getItemLocal('nom')
        .then(res => {
            this.setState({nom: res});
        });
        getItemLocal('email')
            .then(res => {
                this.setState({email: res});
            });
        getItemLocal('prenom')
            .then(res => {
                this.setState({prenom: res});
            });
        getItemLocal('phone')
            .then(res => {
                this.setState({phone: res});
            });
        
    }

    save = ()=>{
        const {
            pswd,
            nemail,
            nphone,
            npswd,
            id
        } = this.state;
        var data = "";
        if(this.state.type === 'mdp'){
            data = JSON.stringify({
                action: 'modifier',
                type:'password',
                id:id,
                password: pswd,
                npassword:npswd
            })
        }else if(this.state.type ==='téléphone'){
            data = JSON.stringify({
                action: 'modifier',
                type:'phone',
                id:id,
                input: nphone,

            })
        }else{
            data = JSON.stringify({
                action: 'modifier',
                type:'email',
                id:id,
                input: nemail,
            })
        }
        NetInfo.isConnected.fetch().then( isConnected => {
            if(isConnected){
                this.setState({isVisibleLoad:true})
                fetch(BASE_URL+'modifier',{
                    method:'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:data
                })
                .then((response)=>response.json())
                    .then((resJson)=>{
                        if(resJson.Error == "no"){
                            var donne = JSON.parse(data);
                            console.log(donne.type);
                            if(donne.type != 'password'){
                                AsyncStorage.setItem(donne.type,donne.input)
                                    .then(()=>{
                                        this.getAlldata();
                                        this.refs.toast.show('Modification avec succès',DURATION.LENGTH_LONG)
                                        this.setState({ modalVisible: false, disabled:true })
                                    })
                            }else{
                                this.setState({ modalVisible: false, disabled:true ,pswd:'',npswd:'',cnpswd:''})
                                this.refs.toast.show('Votre mot de passe à été changé avec succès',DURATION.LENGTH_LONG)
                            }
                        }else{
                            this.setState({ modalVisible: false, disabled:true })
                            this.refs.toasterr.show(resJson.Msg,2000)
                        }
                        console.log(resJson);
                        
                        this.setState({isVisibleLoad:false})    
                    })
                    .catch((err)=>{
                        console.log(err)
                        this.setState({isVisibleLoad:false})   
                        this.setState({ modalVisible: false, disabled:true })
                    })
            }else{
                this.setState({ modalVisible: false, disabled:true })
                this.refs.toast.show('Aucun connexion internet',DURATION.LENGTH_LONG)
            }
        });
                
        
    }
    close = ()=>{
        this.setState({ modalVisible: false, disabled:true, show:false })
    }
    contentModal = ()=>(
        <View style={styles.content}>
            
            {
                this.state.type ==='mdp' 
                ? 
                (
                    <View>
                        <Text style={styles.titleModal}>Modifier mon mot de passe
                        </Text>
                        <FloatingLabelInput
                            attrName = 'pswd'
                            title = 'Ancien mot de passe'
                            value = {this.state.pswd}
                            type="default"
                            updateMasterState = {this._updateMasterState}
                            secureTextEntry
                        />
                        <FloatingLabelInput
                            attrName = 'npswd'
                            title = 'Nouveau mot de passe'
                            type="default"
                            value = {this.state.npswd}
                            updateMasterState = {this._updateMasterState}
                            secureTextEntry
                        />
                        <FloatingLabelInput
                            attrName = 'cnpswd'
                            title = 'Confirmation nouveau mot de passe'
                            value = {this.state.cnpswd}
                            type="default"
                            updateMasterState = {this._updateMasterState}
                            secureTextEntry
                        />
                    </View>
                ) 
                
                : 
                (
                    <View>
                        <Text style={styles.titleModal}>Modifier mon {this.state.type}
                        </Text>
                        {
                            this.state.type === 'téléphone'
                            ? 
                            (
                                <FloatingLabelInput
                                    attrName = 'nphone'
                                    title = {this.state.type}
                                    value = {this.state.nphone}
                                    type="numeric"
                                    updateMasterState = {this._updateMasterState}

                                />
                            )
                            :
                            (
                                <FloatingLabelInput
                                    attrName = 'nemail'
                                    title = {this.state.type}
                                    value = {this.state.nemail}
                                    type="email-address"
                                    updateMasterState = {this._updateMasterState}

                                />
                            )
                        }
                        
                    </View>
                    
                )
            }
            {
                this.state.show ? 
                (
                    <Text style={styles.error}>{this.state.msg}</Text>
                ):
                (
                    null
                )
            }
            {this.state.isVisibleLoad ? <Loader style="ChasingDots"/> : (

                <View style={{flexDirection:'row'}}>
                    <Button
                    onPress={() => this.close()}
                    title="Fermer"
                    type="clear"
                    titleStyle={{color:COLOR_RED,fontFamily:FONT_REGULAR}}
                    /> 
                    <Button
                    disabled={this.state.disabled}
                    onPress={() => this.save()}
                    title="Confirmer"
                    type="clear"
                    titleStyle={{color:COLOR_GREEN,fontFamily:FONT_REGULAR}}
                    /> 
                </View>
                
            )}
            
            
        </View>
    )

    render(){
        return(
            <View style={styles.container}>
                <ListItem
                    title="Nom "
                    titleStyle={styles.title}
                    subtitle={this.state.nom}
                    subtitleStyle={styles.subtitle}
                    
                    bottomDivider

                />
                <ListItem
                    title="Prénom"
                    titleStyle={styles.title}
                    subtitle={this.state.prenom}
                    subtitleStyle={styles.subtitle}
                    
                    bottomDivider

                />
                <ListItem
                    title="Adresse e-mail"
                    titleStyle={styles.title}
                    subtitle={this.state.email}
                    subtitleStyle={styles.subtitle}
                    rightElement={
                        <Button
                            onPress={()=>{
                                this.setState({
                                    modalVisible:true,
                                    nemail:this.state.email,
                                    type:'adresse e-mail'
                                    })
                            }}
                            icon={
                                <Icon name="edit" size={20} color={COLOR_GRIS} />
                            }
                            type='clear'
                        />}
                    bottomDivider

                />
                <ListItem
                    title="Téléphone"
                    titleStyle={styles.title}
                    subtitle={this.state.phone}
                    subtitleStyle={styles.subtitle}
                    rightElement={
                        <Button
                            onPress={()=>{
                                this.setState({
                                    modalVisible:true,
                                    nphone:this.state.phone,
                                    type:'téléphone'
                                    })
                            }}
                            icon={
                                <Icon name="edit" size={20} color={COLOR_GRIS} />
                            }
                            type='clear'
                        />}
                    bottomDivider
                    
                />
                <ListItem
                    title="Mot de passe"
                    titleStyle={styles.title}
                    subtitleStyle={styles.subtitle}
                    rightElement={
                        <Button
                            onPress={()=>{
                                this.setState({
                                    modalVisible:true,
                                    input:'',
                                    type:'mdp'
                                    })
                            }}
                            icon={
                                <Icon name="edit" size={20} color={COLOR_GRIS} />
                            }
                            type='clear'
                        />}
                    bottomDivider
                />
                <Modal
                    
                    isVisible={this.state.modalVisible}>   
                    {this.contentModal()}
                </Modal>
                <Toast
                        ref="toast"
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                    />
                <Toast
                    ref="toasterr"
                    style={{backgroundColor:COLOR_RED}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLOR_WHITE
    },
    title:{
        fontFamily:FONT_BOLD,
        fontWeight:Platform.OS==='ios'?'bold':null,
        fontSize:15
    },
    subtitle:{
        fontFamily:FONT_REGULAR,
    },
    content: {
        backgroundColor: COLOR_WHITE,
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
      },
    titleModal:{
        fontFamily:FONT_BOLD,
        alignSelf:'center',
        marginBottom:10,
        fontSize:20,
    },
    error:{
        fontFamily:FONT_REGULAR,
        fontStyle:'italic',
        fontSize:12,
        color:COLOR_RED
    }
});