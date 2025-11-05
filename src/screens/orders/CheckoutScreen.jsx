import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
export default function CheckoutScreen(){ return <View style={s.wrap}><Text style={s.h}>Checkout</Text></View>; }
const s=StyleSheet.create({wrap:{flex:1,alignItems:'center',justifyContent:'center'},h:{fontSize:22}});