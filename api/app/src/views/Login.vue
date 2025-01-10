<template>
  <v-main  class="fill-height " style=" font-family: Tahoma, Verdana,san-serif">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col>
          <v-card class="mx-auto elevation-10  pl-3 pr-2 imagehover" style="border-radius: 7px" max-width="700px">
            <v-row>
              <v-col cols="5" style="background-color: #03a89a;border-radius: 7px 0px 0px 7px;border-top: 40px;">
                <v-row>
                  <v-col>
                    <v-img style="margin-left:72px; margin-top:55px;margin-bottom:20px" height="130px" width="130px" :src="url"></v-img>
                  </v-col>
                </v-row>
                <p class=" disable-select text-center pl-4 pr-4" style="font-family: Century Gothic; color: white;margin:auto">
                  Provides comprehensive safety records for 
                  secured monitoring of incidents / accidents happened in HRD Group of Companies
                </p>
              </v-col>
              <v-col>
                <v-layout>
                  <v-spacer>   </v-spacer>    
                    <v-tooltip top>
                    <template v-slot:activator="{on}">
                        <v-icon v-on="on" color='#03a89a' @click="openNewTab()" style="margin-right:15px;margin-top:5px">mdi-help-circle-outline</v-icon>  
                    </template>
                    <span>Help?</span>
                </v-tooltip>
                </v-layout>

                <v-card-title style="margin-left:40px" class="disable-select font-weight-bold mb-5 " id="title" >
                  Safety Investigatory<br>Databank
                </v-card-title>
              <v-form ma-5>
                <v-text-field @keyup.enter="onLogin()" @blur="getInfo()" class="ml-6 mr-10 " v-model="username"
                  dense autocomplete="off" prepend-icon="mdi-account" label="Employee ID" type="text" ref="user">
                </v-text-field>
                <v-text-field  @keyup.enter="onLogin()" class="ml-6 mr-10 " v-model="password" dense prepend-icon="mdi-lock" 
                  label="Password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show">
                  </v-text-field>
              </v-form  >
              <br />
                <v-card-actions>
                  <v-row>
                    <v-col>
                      <v-row >
                        <v-btn style="margin-left:44px" class="font-weight-bold mb-12 " dark color="#03a89a" width="300" height='42'  @click="onLogin()">
                          Login
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import Swal from 'sweetalert2'
import store from '@/store'
import axios from 'axios'
export default {
    name: "",
    data:()=>({
        show: false,
        url:require('../assets/shield.png'),
        username:"",
        password:"",
        loginInfos:{}
    }),
    created(){
        store.commit('CHANGE_CONNECTION', true)
        store.commit('CHANGE_USER_INFO', {})
        store.commit('CHANGE_USER_LOGGING', false)
    },
    
    sockets: {
      connect() {
        store.commit('CHANGE_CONNECTION', true)
      },
      disconnect() {
        this.alert = !this.alert
        this.alertText = 'Could not connect to server. Please try again'
        this.loading = true 
        store.commit('CHANGE_CONNECTION', false)
      }
    },
    methods:{

      openNewTab(){
          window.open('http://hrdapps65:5050/JaeAnn/safetyinvestigatorydatabank_web/-/wikis/Manual', '_blank')
        },


      getInfo() { 
        if(this.username){
          axios.get(`${this.api}/LogInSelect/${this.username}`).then(res=>{
            this.loginInfos = res.data[0]
          })
        } 
      },
      onLogin() {
            if(this.loginInfos == null ||  this.loginInfos == undefined ||  this.loginInfos == {} || this.loginInfos.DeletedDate !== null ){
              const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                timer: 3000,
                showConfirmButton: false
                })
                Toast.fire({
                  icon: 'warning',
                  title: `User does not exist!`
                })    
                this.password = ''
                this.username = ''  
            }
            else if(this.password !== this.loginInfos.Password ){
                const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                timer: 3000,
                showConfirmButton: false
                })
                Toast.fire({
                  icon: 'warning',
                  title: `Incorrect credentials!`
                })    
                this.password = ''
                this.username = ''  
            }else{
              store.commit('CHANGE_USER_INFO', this.loginInfos)
              store.commit('CHANGE_USER_LOGGING', true)
              this.$router.push('/dashboard')    
              const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                timer: 3000,
                showConfirmButton: false
              })
              Toast.fire({
                icon: 'success',
                title: `Welcome ${this.SIdatabank_userInfo.EmployeeName}`
              })     
        } 
      },
    },
    
}
</script>
<style scoped>
#title {
  font-size: 25px;
  color: #03a89a;
}
.disable-select {
    user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
  }
.imagehover {
position: relative;
animation-name: imagehover;
animation-duration: 1s;  
animation-fill-mode: forwards;
}

@keyframes imagehover {
from {bottom: -30px;}
to {bottom: 0px;}
}
</style>

