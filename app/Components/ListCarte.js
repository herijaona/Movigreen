import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {removeArr} from '../Helpers/Functions'
import {
    FONT_REGULAR, FONT_BOLD
} from '../Helpers/Helper'
import AsyncStorage from '@react-native-community/async-storage';


class ListCarte extends Component<Props>{
    constructor(props:Props){
        super(props);
        this.state = {
            carte:this.props.carte,
        }
        console.log(this.props.carte);
    }
    componentWillReceiveProps(nextProps){
        this.setState({carte:nextProps.carte});
    }
    click=(n,m,y,c)=>{
        this.props.onPress?.(n,m,y,c);
    }
    delete= async (number)=>{
        console.log(number);
        console.log(this.state.carte);
        const result = removeArr(number,this.state.carte);
        this.setState({carte:result});
        await AsyncStorage.setItem('cartes',JSON.stringify(result));
        if(this.props.event)
            this.props.event.emit('onDeleteCard');
    }
    renderList=()=>{
        let result;
        result = this.state.carte.map((carte , index)=>{
            const number = carte.number.substr(-4,4);
            return(
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around'}}>
                    <TouchableOpacity
                        key= {carte.id}
                        onPress={
                            ()=>this.click(carte.number,carte.mm,carte.yy,carte.cvc)
                        }
                        style={s.container}
                    >
                        <View style={s.content}>
                            <Image style={s.img} source={require('../assets/img/card.png')}/>
                            <Text style={[s.text]}>{number}</Text>
                            <Text style={[s.text]}>{carte.mm}/{carte.yy}</Text>
                            <Text style={[s.text]}>{carte.cvc}</Text>
                        </View>
                        
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.delete}
                        onPress={
                            ()=>this.delete(carte.number)
                        }
                    >
                        <Image style={s.imgdelete} source={require('../assets/img/delete.png')}/>
                    </TouchableOpacity>
                </View>
                
            )
        });
        return result;
    }
    render(){
        return(
            <View>
                {this.renderList()}
            </View>
        )
    }
}
const s = StyleSheet.create({
    view:{
        flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    },
    container:{
        paddingHorizontal:20,
        marginVertical:5,
    },
    content:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#afafaf',
        width:'85%'
    },
    img:{
        resizeMode:'contain',
        width:48,
        height:48
    },
    text:{
        fontSize:18,
        color:'#afafaf',
        fontFamily:FONT_REGULAR

    },
    delete:{
        justifyContent:'center',
        marginRight:10
    },
    imgdelete:{
        resizeMode:'contain',
        width:40,
        height:40
    }
});
export default ListCarte;