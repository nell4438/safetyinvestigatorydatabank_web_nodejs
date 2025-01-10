<template>
  <div >
    <v-app id="inspire" style="background: #f6f9fb; font-family:helvetica">
      <v-navigation-drawer  dense :value="navDrawerVal" app color='#ffffff' width='235' clippped >

        <div id="background-wrap" v-show='bubble_show'>
          <div class="bubble x1"></div>
          <div class="bubble x2"></div>
          <div class="bubble x3"></div>
          <div class="bubble x4"></div>
          <div class="bubble x5"></div>
          <div class="bubble x6"></div>
          <div class="bubble x7"></div>
          <div class="bubble x8"></div>
          <div class="bubble x9"></div>
          <div class="bubble x10"></div> 
          <div class="bubble x11"></div> 
          <div class="bubble x12"></div> 
        </div>

          <v-list-item>
              <v-list-item-content class="ma-2 text-center">
                <v-list-item-avatar size="112">
                    <img v-if="isLogin" style="border: 3px solid #eeeeee;" :src="`http://hrd-adminweb/photos/${SIdatabank_userInfo.EmployeeID}.jpg`" @error="viewAltImage">
                </v-list-item-avatar>

                <v-list-item-title style="font-size:20px; color:#525252" class="mt-2">{{ SIdatabank_userInfo.EmployeeID }}</v-list-item-title>
                <v-list-item-subtitle >{{ getUserLevel }}</v-list-item-subtitle>
                <v-list-item-subtitle class="mb-3">{{ SIdatabank_userInfo.EmployeeName }}</v-list-item-subtitle>
                
                <v-divider></v-divider>
              </v-list-item-content>
          </v-list-item>            
              
    <v-list shaped dense>

      <template v-for="item in drawerItems">
        <v-list-group  v-show=" SIdatabank_userInfo.UserLevel == 1" v-if="item.children" :key="item.text" v-model="item.model">

          <!-- Main Item with Dropdown -->

          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- Main Item with Dropdown Child -->
          <v-list-item  v-for="(child, i) in item.children" :key="i" link @click="visitPage(child.name)">
            
              <!-- @click="visitPage(child.name)" -->

            <v-list-item-action>
              <v-icon></v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ child.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- Main Item only -->

            <v-list-item v-else :key="item.text" link @click="visitPage(item.name)">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

          <template v-slot:append v-if="this.month_array.includes(this.currentmonth)">
            <div class="pa-0" >
             <center> <span v-show="countdown_show_pict" class="animate-charcter">{{countdown}}</span></center> 
             <img v-show="countdown_show_pict" :src="x_mass_Santa_GIF" alt="ArrowLogo" width="240px" height="110px"> 
            </div>
          </template>



       <template v-else>
        <v-footer padless fixed min-height="10">
          <v-container>
            <span class="ma-2" style="font-size: 12px"> v1.0.0</span>
          </v-container>
        </v-footer>
       </template>



      </v-navigation-drawer>   

          <v-app-bar v-if="isLogin" height='50' app color='#ffffff'>
            <v-app-bar-nav-icon @click="navDrawerHide(null)"></v-app-bar-nav-icon>
            <div class=" disable-select hidden-sm-and-down">
              <v-container>
                <v-card-subtitle class='pt-0 pb-0 mb-0 ' style="font-size:20px; color: #525252">
                  {{getCompany}}
                </v-card-subtitle>
              </v-container> 
            </div>

            <v-spacer></v-spacer>
                  <v-btn  @click="logout()" depressed>Logout<v-icon>mdi-logout-variant</v-icon> 
                  </v-btn>
          </v-app-bar>
      <router-view></router-view>
    </v-app>
</div>
</template>
<script>
import moment from 'moment'
import Swal from 'sweetalert2'
import store from '@/store'
export default {
  data() {
    return {
    currentDate : moment().format("MM-DD"),
    currentmonth : moment().format("MM"),
     month_array:['09','10','11','12'],
    december_array:['12-24','12-25','12-26','12-27','12-28','12-29','12-30','12-31'],
    currentDay : moment().format("DD"),
    countdown_show_pict:true,
    x_mass_Santa_GIF :'',
    countdown:'',
    UserLevelName:[],
    navDrawerList: [],
    user:{},
    isConnected: false,
    bubble_show: true,
    drawerItems: [
    {
      icon: 'mdi-monitor-dashboard',
      color:'red',
      text: 'Dashboard',
      name: 'DashBoard',
    },
    {
      icon: 'mdi-database-search',
      text: 'Records',
      name:'Records'
    },
    {
      icon: "mdi-cog",
      text: "Maintenance",
      model: false,
      children: [
        {
          icon: "mdi-account",
          text: "Users",
          name: "UserMaintenance",
        },
        {
          text: "Classifications",
          name: "Classifications",
        },
        {
          text: "Extent of Injury",
          name: "extentofinjury",
        },
        {
          text: "Extent of Damaged",
          name: "extentofdamaged",
        },
        {
          text: "Level of Injury",
          name: "levelofinjury",
        },
        {
          text: "Parts Injured",
          name: "partsinjured",
        },
        {
          text: "Property Damaged",
          name: "propertydamaged",
        },
        
        {
          text: "Primary TME",
          name: "primarytme",
        },
        {
          text: "Secondary TME",
          name: "secondarytme",
        },
      ],
    },
  ],    
}
},
metaInfo(){
  return{
      link: [
        { rel: 'icon', href: './favicon.ico' } 
    ]
  }
},
created() {
  this.calculateChristmasCountdown()
  // this.x_mass_Santa_GIF = './img/santa_GIF.gif'
  this.getSafetyUsers()
  this.show_bubble_december()

},
computed:{
    getCompany(){
      let companyName = "" 
      if(this.SIdatabank_userInfo.CompanyCode === "00"){
        companyName = 'PV Tech. Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "10"){
        companyName = 'SCAD Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "20"){
        companyName = 'HTI Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "30"){
        companyName = 'HRD Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "40"){
        companyName = 'WuKong Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "50"){
        companyName = 'Majestic Landscape Corporation Safety Investigatory Databank'
      }
      else if (this.SIdatabank_userInfo.CompanyCode === "60"){
        companyName = 'Majestics Energy Corporation Safety Investigatory Databank'
      } 
      else if (this.SIdatabank_userInfo.CompanyCode === "70"){
        companyName = 'Dream Best Academy and Learning Safety Investigatory Databank'
      }
      else {companyName = ""}
      return companyName
    },
    getUserLevel(){
      let userLevelName
        this.UserLevelName.forEach(rec=>{
        if(rec.EmployeeID == this.SIdatabank_userInfo.EmployeeID){
        userLevelName =  rec.UserLevels
        }
      })
      return userLevelName
    },
},
watch:{

},
methods: {

    show_bubble_december(){
       if(this.month_array.includes(this.currentmonth)){
          this.bubble_show = true
       }else{
         this.bubble_show = false
       }
    },

  calculateChristmasCountdown(){
    if(this.month_array.includes(this.currentmonth)){

     this.x_mass_Santa_GIF = this.december_array.includes(this.currentDate) ? ('./img/todayis-x-mas.gif')   :  ('./img/santa_GIF.gif') 
      var now = new Date();
      var currentMonth = (now.getMonth() + 1);
      var currentDay = now.getDate();

      var nextChristmasYear = now.getFullYear();
      if(currentMonth == 12 && currentDay > 25){
          nextChristmasYear = nextChristmasYear + 1;
      }

      let hours = moment().hour();
      let nextChristmasDate =''
      
       if(hours >= 8 ){
           nextChristmasDate = nextChristmasYear + '-12-26T00:00:00.000Z';
       }else{
          nextChristmasDate = nextChristmasYear + '-12-25T00:00:00.000Z';
       }


      var christmasDay = new Date(nextChristmasDate);

      var diffSeconds = Math.floor((christmasDay.getTime() - now.getTime()) / 1000);

      var days = 0;
          days = Math.floor(diffSeconds / (3600*24));

      if(this.december_array.includes(this.currentDate)){
          this.countdown = 'Merry Christmas & Happy New Year'
       }else{
          this.countdown = days + ' ' +  "days left"
       }

      }else{
          this.countdown_show_pict = false
        } 

  },
  
  getSafetyUsers(){
          this.axios.get(`${this.api}/getSafetyUsers/${this.SIdatabank_userInfo.CompanyCode}`).then(res=>{  
          this.UserLevelName = res.data 
        })
      },
  viewAltImage(event){
    event.target.src = "http://hrdapps48:3001/ftp/employee_pictures/unkown.png"
      },
    logout() {
          store.commit('CHANGE_USER_INFO', {})
          store.commit('CHANGE_USER_LOGGING', false)
          store.commit('CHANGE_NAVDRAWER', false)
          this.$router.push('/login')
            const Toast =  
          Swal.mixin({
          toast: true,
          position: 'top',
          timer: 3000,
          showConfirmButton: false
        })
        Toast.fire({
          icon: 'success',
          title: `Successfully logged out`
      })
    },
    visitPage(page) {
        this.$router.push(page).catch(() => {});
    },
  navDrawerHide(path) {
    if(!store.state.navDrawerVal) {
        store.commit('CHANGE_NAVDRAWER', true)
    } else {
        store.commit('CHANGE_NAVDRAWER', false)
    }
    if(path != null) {
      this.$router.push(path).catch(err => {
      if(err.name != 'NavigationDuplicated') {
      console.log(err)
        }
      })
    }
  }
}
}

</script>
<style>
body {
background-color: lightblue;
overflow:hidden;
}
.disable-select {
  user-select: none; /* supported by Chrome and Opera */
 -webkit-user-select: none; /* Safari */
 -khtml-user-select: none; /* Konqueror HTML */
 -moz-user-select: none; /* Firefox */
 -ms-user-select: none; /* Internet Explorer/Edge */
}

/* ======================================================== */

.animate-charcter
{
 text-transform: uppercase;
background-image: linear-gradient(
  -225deg,
  #231557 0%,
  #f14029 29%,
  #008080 67%,
  #fff800 100%
);
background-size: auto auto;
background-clip: border-box;
background-size: 200% auto;
color: #fff;
background-clip: text;
text-fill-color: transparent;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
animation: textclip 5s linear infinite;
display: inline-block;
    font-size: 16px;
}

@keyframes textclip {
to {
  background-position: 200% center;
}
}

/* ================================================ */


@-webkit-keyframes animateBubble {
  0% {
      margin-top: -900px;
  }
  100% {
      margin-top: -50%;
  }
}

@-moz-keyframes animateBubble {
  0% {
      margin-top: -900px;
  }
  100% {
      margin-top: -50%;
  }
}

@keyframes animateBubble {
  0% {
      margin-top: -900px;
  }
  100% {
      margin-top: -50%;
  }
}

@-webkit-keyframes sideWays { 
  0% { 
      margin-left:0px;
  }
  100% { 
      margin-left:50px;
  }
}

@-moz-keyframes sideWays { 
  0% { 
      margin-left:0px;
  }
  100% { 
      margin-left:50px;
  }
}

@keyframes sideWays { 
  0% { 
      margin-left:0px;
  }
  100% { 
      margin-left:50px;
  }
}



.x1 {
  -webkit-animation: animateBubble 25s linear infinite, sideWays 2s ease-in-out infinite alternate;
-moz-animation: animateBubble 25s linear infinite, sideWays 2s ease-in-out infinite alternate;
animation: animateBubble 25s linear infinite, sideWays 2s ease-in-out infinite alternate;

left: -5%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}

.x2 {
  -webkit-animation: animateBubble 28s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 28s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 28s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 5%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}

.x3 {
  -webkit-animation: animateBubble 19s linear infinite, sideWays 2s ease-in-out infinite alternate;
-moz-animation: animateBubble 19s linear infinite, sideWays 2s ease-in-out infinite alternate;
animation: animateBubble 19s linear infinite, sideWays 2s ease-in-out infinite alternate;

left: 10%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x4 {
  -webkit-animation: animateBubble 15s linear infinite, sideWays 3s ease-in-out infinite alternate;
-moz-animation: animateBubble 15s linear infinite, sideWays 3s ease-in-out infinite alternate;
animation: animateBubble 15s linear infinite, sideWays 3s ease-in-out infinite alternate;

left: 20%;
top: 100;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x5 {
  -webkit-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 30%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x6 {
  -webkit-animation: animateBubble 21s linear infinite, sideWays 2s ease-in-out infinite alternate;
-moz-animation: animateBubble 21s linear infinite, sideWays 2s ease-in-out infinite alternate;
animation: animateBubble 21s linear infinite, sideWays 2s ease-in-out infinite alternate;

left: 50%;
top: 100;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x7 {
  -webkit-animation: animateBubble 20s linear infinite, sideWays 2s ease-in-out infinite alternate;
-moz-animation: animateBubble 20s linear infinite, sideWays 2s ease-in-out infinite alternate;
animation: animateBubble 20s linear infinite, sideWays 2s ease-in-out infinite alternate;

left: -10%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x8 {
  -webkit-animation: animateBubble 22s linear infinite, sideWays 3s ease-in-out infinite alternate;
-moz-animation: animateBubble 22s linear infinite, sideWays 3s ease-in-out infinite alternate;
animation: animateBubble 22s linear infinite, sideWays 3s ease-in-out infinite alternate;

left: 50%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}

.x9 {
  -webkit-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 50%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x10 {
  -webkit-animation: animateBubble 15s linear infinite, sideWays 2s ease-in-out infinite alternate;
-moz-animation: animateBubble 15s linear infinite, sideWays 2s ease-in-out infinite alternate;
animation: animateBubble 15s linear infinite, sideWays 2s ease-in-out infinite alternate;

left: 75%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}

.x11 {
  -webkit-animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 50%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}

.x12 {
  -webkit-animation: animateBubble 24s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 24s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 24s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 30%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}

.x13 {
  -webkit-animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 23s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 30%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}


.x14 {
  -webkit-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 29s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 30%;
top: 100%;

-webkit-transform: scale(0.1);
-moz-transform: scale(0.1);
transform: scale(0.1);
}


.x15 {
  -webkit-animation: animateBubble 22s linear infinite, sideWays 4s ease-in-out infinite alternate;
-moz-animation: animateBubble 22s linear infinite, sideWays 4s ease-in-out infinite alternate;
animation: animateBubble 22s linear infinite, sideWays 4s ease-in-out infinite alternate;

left: 30%;
top: 100%;

-webkit-transform: scale(0.2);
-moz-transform: scale(0.2);
transform: scale(0.2);
}



.bubble {
-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%;

-webkit-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2), inset 0px 10px 30px 5px #008080;
-moz-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2), inset 0px 10px 30px 5px #008080;
box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2), inset 0px 10px 30px 5px #8edfdf;

height: 70px;
position: absolute;
width: 70px;
}

.bubble:after {
  background: -moz-radial-gradient(center, ellipse cover,  rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%); 
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(255,255,255,0.5)), color-stop(70%,rgba(255,255,255,0))); 
  background: -webkit-radial-gradient(center, ellipse cover,  rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%); 
  background: -o-radial-gradient(center, ellipse cover,  rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%); 
  background: -ms-radial-gradient(center, ellipse cover,  rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%); 
  background: radial-gradient(ellipse at center,  rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 70%); 
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#80ffffff', endColorstr='#00ffffff',GradientType=1 ); 

-webkit-border-radius: 50%;
-moz-border-radius: 50%;
border-radius: 50%;

  -webkit-box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
-moz-box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);

content: "";
height: 90px;
left: 10px;
position: absolute;
width: 90px;
}







</style>

