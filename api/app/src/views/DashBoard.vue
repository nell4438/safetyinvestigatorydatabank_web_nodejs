<template >    
<div>
    <v-main >
      <v-overlay :value="isloading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    
  <!--Total Reports Section  -->

        <div class="ml-3 mr-3 mt-3">
          <v-row>
            <v-col>
          <v-card-subtitle  class=' pt-1 ' style="font-size:20px; color: #525252 "> 
            Dashboard 
          </v-card-subtitle>  
          
            </v-col>
            <v-col>
              <v-tooltip top>        
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small tile  v-show="overAllbtn == false" v-bind="attrs"  v-on="on"  style="float:right;margin-right:40px" @click="OverAllRecord()" >Over All Report<v-icon color="#5aa3c3" >mdi-alpha-a-box-outline</v-icon></v-btn>
                            </template>
                        <span>Over All Report</span> 
                    </v-tooltip>
                    <v-tooltip top>        
                            <template  v-slot:activator="{ on, attrs }">
                              <v-btn  small tile v-show="overAllbtn == true"   @click="presentRecord()"  v-bind="attrs"  v-on="on"  style="float:right;margin-right:40px">Present Report<v-icon color='#03a89a'>mdi-alpha-p-box-outline</v-icon></v-btn>
                            </template>
                        <span>Present Report</span> 
                    </v-tooltip>
            </v-col>
          </v-row>

          <div style="font-family:helvetica" class="fadeIn1">
            <v-sheet style="text-align:center" elevation='4' :color="overAllbtn == true ? '#5aa3c3' : '#03a89a'" dark rounded>
                <v-card-title class="pa-1" style="font-size:14px">        
                  <v-row>
                    <v-col>
                      <div v-if='overAllbtn == false'>{{formatYear(tmpObjData.CurrentDate)}} Total Report</div>
                      <div v-else>Over All Report</div>
                      <div style="font-size:30px">{{ TotalReport }}
                      </div>    
                      
                    </v-col>
                  </v-row>
                </v-card-title>
              </v-sheet>
            </div>
          </div>

        <!-- Charts -->
  <!--Major Accident Chart  -->

      <div class="ml-3 mr-3 mt-8" style="font-family:helvetica">
            
            <v-row>

                <v-col>   
                  <v-card elevation='3' class="fadeIn ">
                    <v-card-subtitle v-if='overAllbtn == false' style="float:right; font-size:25px">
                      {{objDashBoardHeader.MajorAccident ? objDashBoardHeader.MajorAccident : '0'}}
                    </v-card-subtitle>
                    <v-card-subtitle v-else style="float:right; font-size:25px">
                      {{objDashBoardHeaderAll.MajorAccident ? objDashBoardHeaderAll.MajorAccident : '0'}}
                    </v-card-subtitle>
                      <v-sheet class="v-sheet--offset  ml-4  img-hover-zoom" color="#e9534f" elevation="3" max-width="70" height='62' dark align='center' rounded>
                        <v-icon style="margin-top:12px" size='40px'>mdi-clipboard-arrow-up-outline</v-icon>
                      </v-sheet>
                      <v-divider></v-divider>
                      <v-card-subtitle class="pa-2 ml-2 mr-2" >
                        <v-layout>
                          <v-spacer></v-spacer>
                          <span>Major Accident</span>
                        </v-layout>
                      </v-card-subtitle> 
                    </v-card>
                </v-col>

  <!-- Minor Accident Chart -->

                <v-col>
                  <v-card elevation='3' class="fadeIn">
                    <v-card-subtitle  v-if='overAllbtn == false' style="float:right; font-size:25px">
                      {{objDashBoardHeader.MinorAccident ? objDashBoardHeader.MinorAccident : '0'}}
                    </v-card-subtitle>
                    <v-card-subtitle v-else style="float:right; font-size:25px">
                      {{objDashBoardHeaderAll.MinorAccident ? objDashBoardHeaderAll.MinorAccident : '0'}}
                    </v-card-subtitle>
                      <v-sheet class="v-sheet--offset  ml-4  img-hover-zoom" color="#5bc0de" elevation="3" max-width="70" height='62' dark align='center' rounded>
                        <v-icon style="margin-top:12px" size='40px'> mdi-clipboard-arrow-down-outline</v-icon>
                      </v-sheet>
                      <v-divider></v-divider>
                      <v-card-subtitle class="pa-2 ml-2 mr-2" >
                        <v-layout>
                          <v-spacer></v-spacer>
                          <span>Minor Accident</span>
                        </v-layout>
                      </v-card-subtitle> 
                  </v-card>
                </v-col>

  <!-- Fire Incident Chart -->

                <v-col>
                  <v-card elevation='3' class="fadeIn">
                    <v-card-subtitle   v-if='overAllbtn == false' style="float:right; font-size:25px">
                      {{objDashBoardHeader.FireIncident ? objDashBoardHeader.FireIncident : '0'}}
                    </v-card-subtitle>
                    <v-card-subtitle v-else style="float:right; font-size:25px">
                      {{objDashBoardHeaderAll.FireIncident ? objDashBoardHeaderAll.FireIncident : '0'}}
                    </v-card-subtitle>
                      <v-sheet class="v-sheet--offset  ml-4  img-hover-zoom" color="#ff9933" elevation="3" max-width="70" height='62' dark align='center' rounded>
                        <v-icon style="margin-top:12px" size='40px'>mdi-fire-extinguisher</v-icon>
                      </v-sheet>
                      <v-divider></v-divider>
                      <v-card-subtitle class="pa-2 ml-2 mr-2" >
                        <v-layout>
                          <v-spacer></v-spacer>
                          <span>Fire Incident</span>
                        </v-layout>
                      </v-card-subtitle> 
                    </v-card>
                  </v-col>

  <!-- Forklift Incident Chart -->

                  <v-col>
                    <v-card elevation='3' class="fadeIn">
                      <v-card-subtitle v-if='overAllbtn == false' style="float:right; font-size:25px">
                        {{objDashBoardHeader.ForkLiftIncident ? objDashBoardHeader.ForkLiftIncident : '0'}}
                      </v-card-subtitle>
                      <v-card-subtitle v-else style="float:right; font-size:25px">
                        {{objDashBoardHeaderAll.ForkLiftIncident ? objDashBoardHeaderAll.ForkLiftIncident : '0'}}
                      </v-card-subtitle>
                        <v-sheet class="v-sheet--offset  ml-4  img-hover-zoom" color="#03a89a" elevation="3" max-width="70" height='62' dark align='center' rounded>
                          <v-icon style="margin-top:12px" size='40px'> mdi-forklift</v-icon>
                        </v-sheet>
                        <v-divider></v-divider>
                        <v-card-subtitle class="pa-2 ml-2 mr-2" >
                        <v-layout>
                          <v-spacer></v-spacer>
                          <span>Forklift Incident</span>
                        </v-layout>
                      </v-card-subtitle> 
                    </v-card>
                  </v-col>

    <!-- Incidents Chart -->

                  <v-col>
                    <v-card elevation='3' class="fadeIn">
                      <v-card-subtitle  v-if='overAllbtn == false' style="float:right; font-size:25px">
                        {{objDashBoardHeader.Incident ? objDashBoardHeader.Incident : '0'}}
                      </v-card-subtitle>
                      <v-card-subtitle v-else style="float:right; font-size:25px">
                        {{objDashBoardHeaderAll.Incident ? objDashBoardHeaderAll.Incident : '0'}}
                      </v-card-subtitle>
                        <v-sheet class="v-sheet--offset  ml-4  img-hover-zoom" color="#4682b4" elevation="3" max-width="70" height='62' dark align='center' rounded>
                          <v-icon style="margin-top:12px" size='40px'>mdi-clipboard-alert-outline</v-icon>
                        </v-sheet>
                        <v-divider></v-divider>
                        <v-card-subtitle class="pa-2 ml-2 mr-2" >
                        <v-layout>
                        <v-spacer></v-spacer>
                          <span>Incident</span>
                        </v-layout>
                      </v-card-subtitle> 
                    </v-card>
                  </v-col>

            </v-row>

        </div>

  <!-- Lastest Recorded Incident Label -->

        <div class="ml-3 mr-3 mt-4">
          <v-card-subtitle class='pt-1' style="font-size:17px; color: #525252;">
            Latest Recorded Incidents
          </v-card-subtitle>  
          <v-divider class="mb-6 ml-3 mr-3"></v-divider>
        </div>
 

  <!-- Top 1 Latest Incident Recorded Chart -->

  <template>
    <div v-if="tmpObjData.Department != undefined && tmpObjData2.Department != undefined " class="ml-3 mr-3 " >
      <v-row>
        <v-col cols="6" >
          <v-card class="imagehover"> 
            <v-sheet class="v-sheet--offset  ml-4 mr-4 " :color="overAllbtn == true ? '#5aa3c3' : '#03a89a'"  elevation="3" height='50' dark>
              <div  class="ma-1 pa-3 ml-2 mt-1">
                Incident Happened at {{(tmpObjData.Department != undefined && tmpObjData.Department != null && tmpObjData.Department != '') ? tmpObjData.Department : ''}} Department 
              </div>
            </v-sheet>

                  <v-row>
                    <v-card-text align="center">
                      <v-row style="color: #525252">
                        <v-col class="pt-2">
                          <span style="font-weight:bold ">Date Happened:</span> 
                            {{tmpObjData.DateHappened ?  formatYearMonthDay(tmpObjData.DateHappened) : '' }}
                        </v-col>

                        <v-col class="pt-2">
                          <span style="font-weight:bold"> Nature of Injury:</span>
                          {{tmpObjData.NatureOfInjury}}
                        </v-col>
                      </v-row>

                      <v-row style="color: #525252">
                        <v-col class="pt-2">
                          <span style="font-weight:bold"> Level:</span> 
                          {{tmpObjData.InjuryLevel}}
                        </v-col>
                        <v-col class="pt-2">
                        <span style="font-weight:bold">Degree:</span> 
                          {{tmpObjData.AccidentDegree}}
                        </v-col>     
                      </v-row>
                    </v-card-text>

      <!--Top 1  Cause and Effect Images   -->

                  <v-row>
                    <v-container>
                      <v-col align="center">
                        <v-hover v-slot:default="{ hover }">
                            <v-img 
                              class="fadeIn"
                              :src="CauseImage1" 
                              @click="CauseImg1(CauseImage1)" 
                              style="border:1px solid black ;max-height: 100% ;max-width:390px">

                            <v-expand-transition>
                              <div 
                                v-if="hover" 
                                class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                style="height: 100%; font-family:Helvetica;">
                                Click to View</div>
                            </v-expand-transition>
                            </v-img>
                        </v-hover>
                        <v-card-subtitle class='pt-3'>Image Cause</v-card-subtitle>
                      </v-col>

                      <v-col align="center">
                        <v-hover v-slot:default="{ hover }">
                          <v-img 
                            class="fadeIn"
                            @click="EffectImg1(EffectImage1)" 
                            style="border:1px solid black ;max-height: 100%;max-width:390px"
                            :src="EffectImage1">

                            <v-expand-transition>
                              <div 
                                v-if="hover" 
                                class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                style="height: 100%;font-family:Helvetica" 
                              >Click to View</div>
                            </v-expand-transition>
                          </v-img>
                        </v-hover>
                        <v-card-subtitle class='pt-3'>Image Effect</v-card-subtitle>
                      </v-col>
                    </v-container>
                  </v-row>
              </v-row>
          </v-card>
        </v-col>

      <!-- Top 2 Latest Incident Recorded Chart -->

        <v-col cols="6" >
          <v-card  class="imagehover"> 
            <v-sheet 
              class="v-sheet--offset  ml-4 mr-4 "
              :color="overAllbtn == true ? '#5aa3c3' : '#03a89a'" 
              elevation="3"
              height='50'
              dark>
              
              <div class="ma-1 pa-3 ml-2 mt-1"
                >Incident Happened at {{(tmpObjData2.Department != undefined && tmpObjData2.Department != null && tmpObjData2.Department != '') ? tmpObjData2.Department : ''}} Department  
              </div>
            </v-sheet>

                <v-row>

                  <v-card-text align="center">
                    <v-row style="color: #525252">
                      <v-col class="pt-2" >
                          <span style="font-weight:bold"> Date Happened:</span> {{ tmpObjData2.DateHappened ?  formatYearMonthDay(tmpObjData2.DateHappened) : ''}} 
                      </v-col>
                      <v-col class="pt-2">
                        <span style="font-weight:bold"> Nature of Injury:</span> 
                        {{tmpObjData2.NatureOfInjury}}
                      </v-col>
                    </v-row>

                    <v-row  style="color: #525252">
                      <v-col class="pt-2">
                        <span style="font-weight:bold">Level:</span> 
                        {{tmpObjData2.InjuryLevel}}
                      </v-col>

                      <v-col class="pt-2" >
                        <span style="font-weight:bold">Degree:</span> 
                        {{tmpObjData2.AccidentDegree}}
                      </v-col>     
                    </v-row>
                  </v-card-text>

          <!--Top 2 Cause and Effect Images  -->
          
                  <v-row>
                    <v-container>
                      <v-col align="center">
                        <v-hover v-slot:default="{ hover }">
                          <v-img 
                            class="fadeIn"
                            @click="CauseImg2(CauseImage2)" 
                            style="border:1px solid black ;max-height: 100%;max-width:390px"
                            :src="CauseImage2">

                              <v-expand-transition>
                                <div 
                                  v-if="hover" 
                                  class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                  style="height: 100%;font-family:Helvetica" 
                                  >Click to View
                                </div>
                              </v-expand-transition>
                          </v-img>
                        </v-hover>
                        <v-card-subtitle class='pt-3'>Image Cause</v-card-subtitle>
                      </v-col>

                      <v-col align="center">
                        <v-hover v-slot:default="{ hover }">
                          <v-img
                            class="fadeIn"
                            @click="EffectImg2(EffectImage2)" 
                            style="border:1px solid black ;max-height: 100%;max-width:390px"
                            :src="EffectImage2">

                              <v-expand-transition>
                                  <div 
                                    v-if="hover" 
                                    class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                    style="height: 100%;font-family:Helvetica" 
                                    >Click to View
                                  </div>
                              </v-expand-transition>
                            </v-img>   
                        </v-hover>    
                      <v-card-subtitle class='pt-3'>Image Effect</v-card-subtitle>
                    </v-col>
                  </v-container>
                </v-row>
              </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>    
  </template>

<!-- Top 1 Latest Incident Recorded Chart without 2nd latest-->

  <template>
    <div v-if=" tmpObjData2.Department == undefined && tmpObjTop1.Department !== undefined  " class="ml-3 mr-3">
      <v-row>
        <v-col  >
          <v-card  class="imagehover"> 
            <v-sheet class="v-sheet--offset  ml-4 mr-4 " :color="overAllbtn == true ? '#5aa3c3' : '#03a89a'"  elevation="3" height='50' dark>
              <div  class="ma-1 pa-3 ml-2 mt-1">
                Incident Happened at {{(tmpObjTop1.Department != undefined && tmpObjTop1.Department != null && tmpObjTop1.Department != '') ? tmpObjTop1.Department : ''}} Department 
              </div>
            </v-sheet>

                  <v-row>
                    <v-card-text style="margin-left:100px;margin-right:100px" align="center">
                      <v-row style="color: #525252">
                        <v-col class="pt-6">
                          <span style="font-weight:bold ">Date Happened:</span> 
                            {{tmpObjTop1.DateHappened ?  formatYearMonthDay(tmpObjTop1.DateHappened) : '' }}
                        </v-col>

                        <v-col class="pt-6">
                          <span style="font-weight:bold"> Nature of Injury:</span>
                          {{tmpObjTop1.NatureOfInjury}}
                        </v-col>
                      </v-row>

                      <v-row style="color: #525252">
                        <v-col class="pt-2">
                          <span style="font-weight:bold"> Level:</span> 
                          {{tmpObjTop1.InjuryLevel}}
                        </v-col>
                        <v-col class="pt-2">
                        <span style="font-weight:bold">Degree:</span> 
                          {{tmpObjTop1.AccidentDegree}}
                        </v-col>     
                      </v-row>
                    </v-card-text>

      <!--Top 1  Cause and Effect Images   -->
                  <v-row>
                      <v-col style="margin-left:100px" align="center">
                        <v-hover v-slot:default="{ hover }">
                            <v-img 
                            
                              :src="top1Cause" 
                              class="mt-4  fadeIn"
                              @click="Top1CauseImg(top1Cause)" 
                              style="border:1px solid black ;max-height: 100%;max-width:390px">

                            <v-expand-transition>
                              <div 
                                v-if="hover" 
                                class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                style="height: 100%; font-family:Helvetica;">
                                Click to View</div>
                            </v-expand-transition>
                            </v-img>
                        </v-hover>
                        <v-card-subtitle class='pt-6'>Image Cause</v-card-subtitle>
                      </v-col>

                      <v-col  style="margin-right:100px" align="center">
                        <v-hover v-slot:default="{ hover }">
                          <v-img 
                            class="mt-4 fadeIn"
                            @click="Top1EffectBtn(top1Effect)" 
                            style="border:1px solid black ;max-height: 100%;max-width:390px"
                            :src="top1Effect">

                            <v-expand-transition>
                              <div 
                                v-if="hover" 
                                class="d-flex transition-fast-in-fast-out black darken-2 v-card--reveal display-1 white--text ImageHover" 
                                style="height: 100%;font-family:Helvetica" 
                              >Click to View</div>
                            </v-expand-transition>
                          </v-img>
                        </v-hover>
                        <v-card-subtitle class='pt-6 mb-4'>Image Effect</v-card-subtitle>
                      </v-col>
                  </v-row>
              </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>    
  </template>

<!-- No record yet top data -->

  <template>
    <div v-if="tmpObjData.Department == undefined && tmpObjData2.Department == undefined && tmpObjTop1.Department == undefined && overAllbtn === false " class="ml-3 mr-3">
      <v-row>
        <v-col  >
          <v-card  class="imagehover"> 
            <v-sheet class="v-sheet--offset  ml-4 mr-4 " :color="overAllbtn == true ? '#5aa3c3' : '#03a89a'"  elevation="3" height='50' dark></v-sheet>
              <v-row>
                  <v-col  style="margin-top:40px; margin-bottom:45px" align="center">
                      <v-img 
                        style="height: 220px;max-width:220px"
                        :src="imageUrl">
                      </v-img>
                      <v-card-subtitle style="font-size:20px" class="mr-5" align="center">No Recorded Incident </v-card-subtitle>
                  </v-col>
              </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>    
  </template>

  <!-- First Latest Incident Pop Up Dialog Box -->

    <v-dialog v-model="ShowCauseDia" max-width='700'>
      <v-card><br/>
        <v-img :src="CauseDiaImg" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

    <v-dialog  v-model="ShowEffectDia" max-width='700'>
      <v-card><br/>
        <v-img :src="EffectDiaImg" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

  <!-- Second Latest Incident Pop Up  Dialog Box -->

    <v-dialog v-model="ShowCauseDia2" max-width='700'>
      <v-card><br/>
        <v-img :src="CauseDiaImg2" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ShowEffectDia2" max-width='700'>
      <v-card><br/>
        <v-img :src="EffectDiaImg2" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

    <!-- Top 1 without 2nd Pop Up  Dialog Box -->

    <v-dialog v-model="ShowTop1Dialog" max-width='700'>
      <v-card><br/>
        <v-img :src="top1Cause" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ShowTop1Dialog2" max-width='700'>
      <v-card><br/>
        <v-img :src="top1Effect" style=" border-radius:1px;border:1px solid grey; max-width:90%;" class="ma-auto">
        </v-img><br/>
      </v-card>
    </v-dialog>

  </v-main>
</div> 
</template>
<script>
import store from '@/store'
import axios from 'axios'
export default {
    data(){
        return{ 
        CompanyPath:'',
        isloading: false,
        overAllbtn: false,
        MajorAccident:'',
        MinorAccident:'',
        FireIncident:'',
        ForkliftIncident:'',
        Incident:'', 
        CauseImage1: '',
        EffectImage1:'',
        CauseImage2: '',
        EffectImage2:'',
        CauseDiaImg2:'',
        EffectDiaImg2:'',
        top1Cause:'',
        top1Effect:'',
        altImage:'http://hv12-hrd41:3001/ftp/FileServer/SafetyInvestigatoryDatabank/NoImageFound.png',
        tmpObjTop1:{},
        ShowCauseDia: null,
        ShowEffectDia: null,
        ShowCauseDia2: null,
        ShowEffectDia2: null,
        CauseDiaImg:'',
        EffectDiaImg:'',
        ShowTop1Dialog:'',
        ShowTop1Dialog2:'',
        user:{},  
        objDashBoardHeaderAll:{},
        objDashBoardHeader: {},
        SafetyImgURL:'http://hv12-hrd41:3001/ftp/FileServer/SafetyInvestigatoryDatabank',
        imageUrl:require('../assets/norecord.png'),
        tmpObjData: {}, // TOP 1
        tmpObjData2: {} // TOP 2
        }
    },

    created(){
      this.user = store.state.SIdatabank_userInfo
      this.onLoad() 
    },
    computed:{
        TotalReport(){
          if(this.overAllbtn == false){
          let total =
            this.objDashBoardHeader.MinorAccident +
            this.objDashBoardHeader.MajorAccident +
            this.objDashBoardHeader.FireIncident +
            this.objDashBoardHeader.ForkLiftIncident +
            this.objDashBoardHeader.Incident
          if (isNaN(total)){
            total = '0'
          }
          return  total
          } else {

          let total =
            this.objDashBoardHeaderAll.MinorAccident +
            this.objDashBoardHeaderAll.MajorAccident +
            this.objDashBoardHeaderAll.FireIncident +
            this.objDashBoardHeaderAll.ForkLiftIncident +
            this.objDashBoardHeaderAll.Incident
          if (isNaN(total)){
            total = '0'
          }
          return  total
          }
        },
    },
    methods: { 
      OverAllRecord(){
        this.overAllbtn = true
        this.GetTopDataOverall()
      },
      presentRecord(){
        this.overAllbtn = false
        this.GetTopData()
      },

// Top 1 Incident Image Dialog Box 

      CauseImg1(CauseImage1){
      this.ShowCauseDia = true
      this.CauseDiaImg = CauseImage1
      },

      EffectImg1(EffectImage1){
      this.ShowEffectDia = true
      this.EffectDiaImg = EffectImage1
      },
      // top 2 Incident Image Dialog Box
      CauseImg2(CauseImage2){
      this.ShowCauseDia2 = true
      this.CauseDiaImg2 = CauseImage2
        
      },
      EffectImg2(EffectImage2){
      this.ShowEffectDia2 = true
      this.EffectDiaImg2 = EffectImage2
      },
       // top 1 without 2nd Image Dialog Box
      Top1CauseImg(top1Cause){
      this.ShowTop1Dialog = true
      this.top1Cause = top1Cause
        
      },
      Top1EffectBtn(top1Effect){
      this.ShowTop1Dialog2 = true
      this.top1Effect = top1Effect
      },

      GetDashboard(){
          this.isloading = true
          axios.get(`${this.api}/DashBoardHeader/${this.SIdatabank_userInfo.CompanyCode}`).then((res)=>{
            this.objDashBoardHeader = res.data
            this.isloading=false
        })
      },
      GetDashboardAll(){
          this.isloading = true
          axios.get(`${this.api}/DashBoardHeaderAll/${this.SIdatabank_userInfo.CompanyCode}`).then(res=>{
            this.objDashBoardHeaderAll =res.data
            this.isloading = false
          })
      },

      GetTopData(){
        this.tmpObjData = {}
        this.tmpObjData2 = {}
        if(this.overAllbtn === false){
          axios.get(`${this.api}/GetTopData/${this.SIdatabank_userInfo.CompanyCode}`).then((res) => {
          if(res.data.length > 1){
          this.isloading = true
          if(this.SIdatabank_userInfo.CompanyCode === '00'){
                this.CompanyPath = 'PV'
                }
                else if(this.SIdatabank_userInfo.CompanyCode === '10'){
                this.CompanyPath = 'SCD'
                }
                else if(this.SIdatabank_userInfo.CompanyCode === '20'){
                this.CompanyPath = 'HTI'
                }
                else if(this.SIdatabank_userInfo.CompanyCode === '30'){
                this.CompanyPath = 'HRD'
                }
                else if(this.SIdatabank_userInfo.CompanyCode === '40'){
                this.CompanyPath = 'WKN'
                }
          
          const Top1 = res.data[0]
          const Top2 = res.data[1]  
          const EffectTop1 = Top1.PictureEffect
            let tmpValEffect1 = EffectTop1.split("/")
            let imgNameEffect1 = tmpValEffect1[tmpValEffect1.length-1]
            res.data[0].imgNameEffect = imgNameEffect1
            
          const CauseTop1 = Top1.PictureCause
            let tmpValCause1 = CauseTop1.split("/")
            let imgNameCause1 = tmpValCause1[tmpValCause1.length-1]
            res.data[0].imgNameCause = imgNameCause1
            
          const EffectTop2 = Top2.PictureEffect
            let tmpValEffect2 = EffectTop2.split("/")
            let imgNameEffect2= tmpValEffect2[tmpValEffect2.length-1]
            res.data[1].imgNameEffect = imgNameEffect2

          const CauseTop2 = Top2.PictureCause
            let tmpValCause2 = CauseTop2.split("/")
            let imgNameCause2= tmpValCause2[tmpValCause2.length-1]
              res.data[1].imgNameCause = imgNameCause2           
          
          
          this.CauseImage1 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameCause}`
          this.EffectImage1 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameEffect}`
          this.CauseImage2 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[1].SirNo}/${res.data[1].imgNameCause}`
          this.EffectImage2 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[1].SirNo}/${res.data[1].imgNameEffect}`
          this.tmpObjData = res.data[0] // top 1
          this.tmpObjData2 = res.data[1] // top 2

          fetch(this.EffectImage1, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    this.EffectImage1 = this.altImage
                }
            }).catch(err => console.log('Error:', err));
          fetch(this.CauseImage1, { method: 'HEAD' })
          .then(res => {
              if (!res.ok) {
                  this.CauseImage1 = this.altImage
              }
          }).catch(err => console.log('Error:', err));
          fetch(this.EffectImage2, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    this.EffectImage2 = this.altImage
                }
            }).catch(err => console.log('Error:', err));
          fetch(this.CauseImage2, { method: 'HEAD' })
          .then(res => {
              if (!res.ok) {
                  this.CauseImage2 = this.altImage
              }
          }).catch(err => console.log('Error:', err));
          } 
          this.isloading=false
        })
        }
      },
      GetTopDataOverall(){
        this.tmpObjData = {}
        this.tmpObjData2 = {}
        if(this.overAllbtn === true){
          axios.get(`${this.api}/GetTopDataOverall/${this.SIdatabank_userInfo.CompanyCode}`).then((res) => {
          if(res.data.length > 1){
          this.isloading = true
          if(this.SIdatabank_userInfo.CompanyCode === '00'){
            this.CompanyPath = 'PV'
            }
            else if(this.SIdatabank_userInfo.CompanyCode === '10'){
            this.CompanyPath = 'SCD'
            }
            else if(this.SIdatabank_userInfo.CompanyCode === '20'){
            this.CompanyPath = 'HTI'
            }
            else if(this.SIdatabank_userInfo.CompanyCode === '30'){
            this.CompanyPath = 'HRD'
            }
            else if(this.SIdatabank_userInfo.CompanyCode === '40'){
            this.CompanyPath = 'WKN'
            }
          
          const Top1 = res.data[0]
          const Top2 = res.data[1]  
          const EffectTop1 = Top1.PictureEffect
            let tmpValEffect1 = EffectTop1.split("/")
            let imgNameEffect1 = tmpValEffect1[tmpValEffect1.length-1]
            res.data[0].imgNameEffect = imgNameEffect1
            
          const CauseTop1 = Top1.PictureCause
            let tmpValCause1 = CauseTop1.split("/")
            let imgNameCause1 = tmpValCause1[tmpValCause1.length-1]
            res.data[0].imgNameCause = imgNameCause1
            
          const EffectTop2 = Top2.PictureEffect
            let tmpValEffect2 = EffectTop2.split("/")
            let imgNameEffect2= tmpValEffect2[tmpValEffect2.length-1]
            res.data[1].imgNameEffect = imgNameEffect2

          const CauseTop2 = Top2.PictureCause
            let tmpValCause2 = CauseTop2.split("/")
            let imgNameCause2= tmpValCause2[tmpValCause2.length-1]
              res.data[1].imgNameCause = imgNameCause2           
          
          
          this.CauseImage1 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameCause}`
          this.EffectImage1 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameEffect}`
          this.CauseImage2 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[1].SirNo}/${res.data[1].imgNameCause}`
          this.EffectImage2 = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[1].SirNo}/${res.data[1].imgNameEffect}`
          this.tmpObjData = res.data[0] // top 1
          this.tmpObjData2 = res.data[1] // top 2

          fetch(this.EffectImage1, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    this.EffectImage1 = this.altImage
                }
            }).catch(err => console.log('Error:', err));
          fetch(this.CauseImage1, { method: 'HEAD' })
          .then(res => {
              if (!res.ok) {
                  this.CauseImage1 = this.altImage
              }
          }).catch(err => console.log('Error:', err));
          fetch(this.EffectImage2, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    this.EffectImage2 = this.altImage
                }
            }).catch(err => console.log('Error:', err));
          fetch(this.CauseImage2, { method: 'HEAD' })
          .then(res => {
              if (!res.ok) {
                  this.CauseImage2 = this.altImage
              }
          }).catch(err => console.log('Error:', err));
          } 
          this.isloading=false
        })
        } 
      },



      GetTop1(){
        axios.get(`${this.api}/GetTop1/${this.SIdatabank_userInfo.CompanyCode}`).then((res) => {
          if(res.data.length == 1 ){
          this.isloading = true
          if(this.SIdatabank_userInfo.CompanyCode === '00'){
                    this.CompanyPath = 'PV'
                    }
                    else if(this.SIdatabank_userInfo.CompanyCode === '10'){
                    this.CompanyPath = 'SCD'
                    }
                    else if(this.SIdatabank_userInfo.CompanyCode === '20'){
                    this.CompanyPath = 'HTI'
                    }
                    else if(this.SIdatabank_userInfo.CompanyCode === '30'){
                    this.CompanyPath = 'HRD'
                    }
                    else if(this.SIdatabank_userInfo.CompanyCode === '40'){
                    this.CompanyPath = 'WKN'
                    }

          const Top1 = res.data[0] 
          const EffectTop1 = Top1.PictureEffect
            let tmpValEffect1 = EffectTop1.split("/")
            let imgNameEffect1 = tmpValEffect1[tmpValEffect1.length-1]
            res.data[0].imgNameEffect = imgNameEffect1
            
          const CauseTop1 = Top1.PictureCause
            let tmpValCause1 = CauseTop1.split("/")
            let imgNameCause1 = tmpValCause1[tmpValCause1.length-1]
            res.data[0].imgNameCause = imgNameCause1
          this.top1Cause = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameCause}`
          this.top1Effect = `${this.SafetyImgURL}/${this.CompanyPath}/${res.data[0].SirNo}/${res.data[0].imgNameEffect}`
          this.tmpObjTop1 = res.data[0] // top 1
          }
          this.isloading=false
          fetch(this.top1Cause, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    this.top1Cause = this.altImage
                }
            }).catch(err => console.log('Error:', err));
          fetch(this.top1Effect, { method: 'HEAD' })
          .then(res => {
              if (!res.ok) {
                  this.top1Effect = this.altImage
              }
          }).catch(err => console.log('Error:', err));
        })
      },
      onLoad(){

        this.GetDashboard();
        this.GetDashboardAll();
        this.GetTop1();
        this.GetTopData()
        
      }
    }
}
</script>
<style scoped>
.v-sheet--offset {
  top: -15px;
  position: relative;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .6;
  position: absolute;
  width: 100%;

}
.ImageHover{
  cursor: pointer;
}
.fadeIn{
  animation: fadeInAnimation ease 1.6s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    80% {
        opacity: 1;
    }
        
}
.fadeIn1{
  animation: fadeInAnimation1 ease 1.3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes fadeInAnimation1 {
    0% {
        opacity: 0;
    }
    
    80% {
        opacity: 1;
    }
        
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

/* [2] Transition property for smooth transformation of images */
.img-hover-zoom  {
  transition: transform .5s ease;
}

/* [3] Finally, transforming the image when container gets hovered */
.img-hover-zoom:hover  {
  transform: scale(1.2);
}


</style>
