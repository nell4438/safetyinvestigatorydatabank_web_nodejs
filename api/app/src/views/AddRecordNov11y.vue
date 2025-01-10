<template>      
    <v-main>
         <!-- {{lengthofservice}}
         <pre>infoData : {{infoData}}</pre> -->
         <!-- {{dayloss}} -->
        <v-overlay :value="isloading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-container>
            <template>
                <v-tooltip top>        
                <template v-slot:activator="{ on, attrs }">     
                <v-btn
                    v-on="on"
                    v-bind="attrs"
                    height='60px'
                    width= '60px'
                    style="margin-bottom: 45px;margin-right:10px"
                    color="#03a89a"
                    @click="AddRecordFinal()"
                    dark
                    absolute
                    bottom
                    right
                    fab
                    fixed >
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                </template>
                <span>Save Record</span>   
                </v-tooltip>
            </template>
            
    <!--  General Information -->
            <v-card style="margin-left: auto;margin-right: auto">
                <v-sheet class="v-sheet--offset mb-6 " color="#03a89a" height='60'>
                    <div>
                        <v-card-subtitle style="font-size:18px; margin-left:8px ;padding-top:20px;color:#ffffff">General Information</v-card-subtitle>
                    </div>
                </v-sheet>

                    <v-form v-model="valid" ref="form" lazy-validation class="pl-10 pr-10">
                        <v-text-field
                            v-model="incidentname"
                            label="Incident Title"
                            outlined
                            :rules="nameRules"
                            dense
                            clearable
                        ></v-text-field>
                    <v-row class="pt-0 mt-0" >
                        <v-col cols="3">
                            <!-- <v-text-field
                                clearable
                                v-model="datehappened"
                                label="Date Happened"
                                :rules="dateRules"
                                v-mask="maskdate"
                                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                hint="YYYY-MM-DD"
                                outlined
                                dense
                            ></v-text-field> -->

                           <v-menu > 
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="datehappened" :rules="dateRules" label="Date Happened" prepend-icon="mdi-calendar-range" readonly v-on="on" outlined dense>
                                </v-text-field>
                            </template>
                            <!-- :min="datemin" :max="currentDate"  -->
                            <v-date-picker  v-model="datehappened" @input="date1 = false"></v-date-picker>      
                           </v-menu> 

                        </v-col> 
                        <v-col cols='3'> 
                            <v-autocomplete
                                v-model="strTypeOfReport"
                                :items="typeofreportitems"
                                :rules="nameRules"
                                label="Type of Report"
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'> 
                            <v-autocomplete 
                                v-model="strAccidentDegree"
                                :items="accidentdegreeitems"
                                :rules="nameRules"
                                label="Accident Degree"
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'> 
                        <v-text-field
                                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                clearable
                                maxlength="5"
                                v-mask="mask"  
                                v-model="timepicker"
                                label="Time Happened"
                                hint="HH:MM"
                                outlined
                                dense
                            ></v-text-field>
                            </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0" >
                        <v-col >
                            <v-text-field
                                v-model="placeofincident"
                                label="Place of Incident"
                                outlined
                                dense
                                clearable
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3"  >
                            <v-text-field
                                label="Date Prepared"
                                prepend-icon="mdi-calendar"
                                outlined
                                dense
                                hint='YYYY-MM-DD'
                                v-mask="maskdate"
                                :value="`${moment().format('YYYY-MM-DD')}`"
                            ></v-text-field>
                        </v-col> 
                    </v-row>    

                    <v-row class="pt-0 mt-0" >
                        <v-col cols='3'> 
                            <v-autocomplete 
                                v-model='injurylevelid'
                                :items='levelofinjuryitems'
                                label="Level of Injury"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'> 
                            <v-text-field
                                v-model="natureofinjury"
                                label="Nature of Injury"
                                outlined
                                clearable
                                dense
                            ></v-text-field>
                        </v-col>
                        <v-col cols='4'> 
                            <v-autocomplete 
                                v-model='extentinjury'
                                :items="extentofinjuryitems"
                                label="Extent of Injury"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='2'>
                            <!-- <v-text-field
                                v-model="dayloss"
                                label="Day Loss"
                                type='number'
                                outlined
                                dense
                            ></v-text-field> -->
                            <v-combobox
                                v-model="dayloss"
                                outlined
                                dense
                                label="Day Loss"
                                clearable
                                :items="dayloss_items"
                            ></v-combobox>
                        </v-col>
                    </v-row>   
                    <v-row class="pt-0 mt-0">
                        <v-col cols='3'> 
                            <v-autocomplete 
                                v-model='partsinjured'
                                :items="partsinjureditems"
                                label="Parts Injured"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-text-field
                                v-model="specificparts"
                                label="Specific Parts"
                                outlined
                                dense
                                clearable
                            ></v-text-field>
                        </v-col>
                        <v-col cols='3'> 
                            <v-autocomplete 
                                v-model='propertydamaged'
                                :items="propertydamageditems"
                                label="Property Damage"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'> 
                            <v-autocomplete 
                                v-model='extentdamage'
                                :items="extentdamageitems"
                                label="Extent Damage"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model='classificationid'
                                :items="classificationitems"
                                label="Classification"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model='primarytme'
                                :items="primetmeitems"
                                label="Prime TME"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3' >
                            <v-autocomplete
                                v-model='secondarytmeid'
                                :items="secondarytmeitems"
                                label="Secondary TME"
                                clearable
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-text-field
                                v-model="partstme"
                                label="Parts of TME"
                                outlined
                                dense
                                clearable
                            ></v-text-field>
                        </v-col>
                    </v-row>

                </v-form>
            </v-card>
            </v-container>

    <!--Persons Involve  -->
    <!-- {{immdtsupervisor1}} -->

            <v-container>
            <v-card style="margin-left: auto;margin-right: auto;margin-top:13px">
                    <v-sheet class="v-sheet--offset mb-6 " color="#03a89a" height='60'>
                        <v-row>
                            <v-col>
                                <v-card-subtitle  class='pt-2' style="font-size:18px; margin-left:8px;color:#ffffff">
                                    Person Involved 
                                </v-card-subtitle>
                            </v-col>
                            </v-row>
                    </v-sheet>
                <!-- v-model='valid2' ref="form2" lazy-validation -->
                <v-form  class="pl-8 pr-8" style="margin-bottom:20px">
                    <v-row class="pt-0 mt-0" >
                        <!-- {{infoData}} -->
                        <v-col >
                        <!-- :rules='nameRules2' -->
                            <v-text-field
                                v-model="EmployeeID1"
                                label="Employee ID"
                                @input="EmployeeInfo()"
                                :persistent-hint="EmployeeID1 !== ''  ? true : false"
                                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                outlined
                                dense
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0" >  
                        <v-col cols='3'>
                            <v-text-field
                                v-model="employeename"
                                label="Employee Name"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='2'>
                            <v-text-field
                                v-model="employeestatus"
                                label="Employee Status"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='3'>
                            <v-text-field
                                v-model="position"
                                label="Position"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='2'>
                            <v-text-field
                                v-model="lengthofservice"
                                label="Length of Service (Years)"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='2'>
                            <v-text-field
                                v-model="lengthofexposure"
                                label="Length of Exposure"
                                outlined
                                dense
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col cols='2'>
                            <v-autocomplete
                                v-model="civilstatus1"
                                :items="CivilStatusItems"
                                label="Civil Status"
                                outlined
                                dense
                                clearable
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='2'>
                            <v-text-field
                                v-model="age"
                                label="Age"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='2'>
                            <v-text-field
                                v-model="gender"
                                label="Gender"
                                outlined
                                dense
                                readonly
                            ></v-text-field>
                        </v-col>
                        <v-col cols='3'>
                            <!-- readonly  :readonly=" employeename != ''  ? true : false"     @change="GetDepartments()"-->
                          {{departmentname}}
                          <!-- item-value="DepartmentCode" -->
                          {{DepartmentList.DepartmentCode}}
                            <v-autocomplete
                                v-model="departmentname"
                                label="Department Name"
                                @change="GetSections(infoData.CompanyCode, DepartmentList.DepartmentCode)"
                                :items="DepartmentList"
                                item-text="DepartmentName"
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <!-- readonly :readonly=" employeename != ''  ? true : false" -->
                            <v-autocomplete
                                v-model="sectionname"
                                label="Section Name"
                                :items="SectionList"
                                item-text="SectionName"
                                outlined
                                dense
                            ></v-autocomplete>
                        </v-col> 
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col cols='3'>
                        <v-autocomplete
                                v-model="workshift"
                                :items="workshiftitems"
                                label="Work Shift"
                                outlined
                                dense
                                clearable
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <!-- :disabled=" selectcompany != '' ? false : true" -->
                            <v-autocomplete
                                v-model='depthead1'
                                :items="GroupOfCompaniesnoFilter"
                                label="Department Head"
                                outlined
                                dense
                                clearable
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model='deptadviser1'
                                :items="JapaneseAdvisers"
                                label="Department A dviser"
                                outlined
                                dense
                                clearable
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <!-- :disabled=" selectcompany != '' ? false : true" -->
                            <v-autocomplete
                                v-model="immdtsupervisor1"
                                :items="GroupOfCompaniesnoFilter"
                                label="Immediate Superior"
                                outlined
                                dense
                                clearable   
                            ></v-autocomplete>
                                 <!-- multiple -->
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>

    <!-- Illustration / Pictures -->

            <v-card   
                style="margin-left: auto;
                margin-right: auto;margin-top:25px" >
                <v-sheet 
                    class="v-sheet--offset mb-6 "
                    color="#03a89a"
                    height='60'>
                    <v-row>
                        <v-col>
                            <v-card-subtitle 
                                class='pt-2' 
                                style="font-size:18px; padding-top:20px; margin-left:8px;color:#ffffff">Illustrations / Pictures</v-card-subtitle>     
                        </v-col>
                        <v-col class="pt-4">
                                    <v-tooltip top>        
                                        <template v-slot:activator="{ on, attrs }">     
                                            <v-icon
                                                v-on='on'
                                                v-bind='attrs'
                                                class="mt-1 mr-6"
                                                size='35px'
                                                color='#ffffff'
                                                @click="ClearPictures()"
                                                style="float:right;font-size:18px " 
                                            >Clear</v-icon>
                                        </template>
                                        <span>Clear Illustrations </span>   
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-sheet>    

                <v-form class="pl-8 pr-8" style="margin-bottom:20px">
                    <v-row  class='pt-2 pb-5' >
                        <v-row >
                            <v-col  align="center" >
                                <v-file-input  
                                    v-model="file" 
                                    style="padding-bottom:20px; max-width:400px; min-width:400px;" 
                                    accept="image/*" 
                                    @change="onFileChange" 
                                    :clearable="false"
                                    ></v-file-input>
                                <v-spacer></v-spacer>
                                <v-img 
                                    style="border:1px solid black ;height: 300px;width:430px"
                                    v-if="imageUrl" :src="imageUrl">
                                </v-img>
                                <span  class="font-weight-light heading">{{myData.filename}}</span>
                                <v-card-subtitle class='pt-4'>Image Cause</v-card-subtitle>
                            </v-col>
                            <v-col   align="center">
                                <v-file-input  
                                    v-model="file2" 
                                    style="padding-bottom:20px; max-width:400px; min-width:400px;"   
                                    accept="image/*" 
                                    @change="onFileChange2" 
                                    :clearable="false"
                                    ></v-file-input>
                                <v-spacer></v-spacer>
                                <v-img 
                                    style="border:1px solid black ;height: 300px;width:430px"
                                    v-if="imageUrl2" :src="imageUrl2">
                                </v-img>
                                <span class="font-weight-light heading">{{myData2.filename}}</span>
                                <v-card-subtitle class='pt-4'  >Image Effect</v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-form>
            </v-card>


    <!-- Witness -->

            <v-card style="margin-left: auto;margin-right: auto;margin-top:25px" >
                <v-sheet class="v-sheet--offset mb-6 " color="#03a89a" height='60'>
                    <v-row>
                        <v-col>
                            <v-card-subtitle class='pt-2' style="font-size:18px; padding-top:20px; margin-left:8px;color:#ffffff">
                                Witnesses / Cost / Violations
                            </v-card-subtitle>        
                        </v-col>
                    </v-row>
                </v-sheet>
                
                <v-form class="pl-8 pr-8" style="margin-bottom:20px">
                    <v-row class="pt-0 mt-0">
                        <v-col cols='6'>
                            <v-text-field
                                v-model="witness1"
                                label="Witness 1"
                                outlined
                                dense
                                clearable
                                 >
                             
                            </v-text-field>
                        </v-col>
                        <v-col cols='6'>
                            <v-text-field
                                v-model="witness2"
                                label="Witness 2 "
                                outlined
                                clearable
                                dense
                                >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model="externalofficer"
                                :items='GroupOfCompaniesnoFilter'
                                label="External Safety Officer"
                                outlined
                                clearable
                                dense >
                            </v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model="safetyleader"
                                :items='GroupOfCompaniesnoFilter'
                                label="Safety Team Leader/Superior"
                                outlined
                                clearable
                                dense>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            
                            <v-autocomplete
                                v-model="fsedepthead"
                                :items='GroupOfCompaniesnoFilter'
                                label="FSE Department Head"
                                outlined
                                clearable
                                dense>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols='3'>
                            <v-autocomplete
                                v-model="fsedeptadviser"
                                :items='JapaneseAdvisers'
                                label="FSE Department Adviser "
                                outlined
                                clearable
                                dense>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col cols='3'>
                            <v-autocomplete
                                    v-model="crrviolation"
                                    :items="crrviolationitems.map(rec=>{
                                        return {
                                            value: rec.CRRID,
                                            text: rec.CRRSection
                                        }
                                    })"
                                    @change="crrdetails = crrviolationitems.filter(rec=>{ return rec.CRRID == crrviolation  }).map(rec1=>{ return rec1.CRRDetails})[0]"
                                    label="CRR Violation"
                                    outlined
                                    dense
                                    clearable
                                ></v-autocomplete>
                            <v-text-field
                                type='number'
                                class="mt-3"
                                v-model="damagecost"
                                label="Damage Cost"
                                hint='0.00 Php'
                                suffix='Php'
                                outlined
                                placeholder='0.00'
                                dense
                            ></v-text-field>
                            <v-text-field
                                type='number'
                                class="mt-4"
                                v-model="damagecharge"
                                label="Damage Charged"
                                outlined
                                hint='0.00 Php'
                                suffix='Php'
                                placeholder='0.00'
                                dense
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-textarea
                                v-model="crrdetails"
                                label="CRR Details"
                                outlined
                                dense
                                rows='7'
                                readonly
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>


    <!-- Other Relevant Details -->
        
            <v-card style="margin-left: auto;margin-right: auto;margin-top:25px" >
                <v-sheet class="v-sheet--offset mb-6 " color="#03a89a" height='60'>
                    <v-row>
                        <v-col>
                            <v-card-subtitle class='pt-2' style="font-size:18px; padding-top:20px; margin-left:8px;color:#ffffff">
                                Investigation Details 
                            </v-card-subtitle>        
                        </v-col>
                    </v-row>
                </v-sheet>
                    <v-form v-model='valid3' ref="form3" lazy-validation>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="descriptiondetail"
                                label="Description/Detail (English)"
                                outlined
                                :rules='nameRules3'
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="furtherinvestigation"
                                label="Further Investigation"
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="digestconclusion"
                                label="Digest Conclusion"
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="rootanalysis"
                                label="Root Cause Analysis"
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="correctiveaction"
                                label="Corrective Actions "
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="unsafeaction"
                                label="Unsafe Action "
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="unsafecondition"
                                label="Unsafe Condition"
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="pt-0 mt-0">
                        <v-col class="pl-11 pr-11">
                            <v-textarea
                                v-model="immediateactiontaken"
                                label="Immediate Action Taken"
                                outlined
                                dense
                                clearable
                                rows='3'
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    </v-form>
            </v-card>
        </v-container>
        
    </v-main>
</template>
<script>
import Swal from 'sweetalert2'
import store from '@/store'
import moment from 'moment'
import axios from 'axios'
import {mask} from 'vue-the-mask'
export default {
    directives: {mask},
    data(){
        return{
            date1: false,
            sirno: '',
            EmployeeID1: '',
            departmentname: '',
            sectionname: '',
            crrviolation: '',
            depthead1: '',
            deptadviser1: '',
            immdtsupervisor1: '',
            incidentname: '',
            descriptiondetail: '',
            timepicker: '',
            natureofinjury: '',
            specificparts: '',
            immediateactiontaken: '',
            furtherinvestigation: '',
            rootanalysis: '',
            witness1: '',
            witness2: '',
            placeofincident: '',
            correctiveaction: '',
            lengthofservice: '',
            lengthofexposure:'',
            unsafeaction: '',
            unsafecondition: '',
            digestconclusion: '',
            externalofficer: '',
            safetyleader: '',
            fsedepthead: '',
            fsedeptadviser: '',
            crrdetails:'',
            CompanyPath:'',
            datepreparedcalendar:'',
            dateprepared:'',
            position:'',
            gender:'',
            employeename:'',
            employeestatus:'',
            selectcompany:'',
            departmentcode:'',
            companycode:'',
            SeqID: 0,
            dayloss: '0',
            damagecost: 0,
            damagecharge: 0,
            age: 0,
            injurylevelid: 0,
            strAccidentDegree: 0,
            strTypeOfReport: 0,
            classificationid: 0,
            partsinjured: 0,
            extentdamage: 0,
            propertydamaged: 0,
            partstme: '',
            primarytme: 0,
            secondarytmeid: 0,
            extentinjury: 0,
            civilstatus1: 0,
            workshift: 0,
            maskdate:'####-##-##',
            // mask:'##:## AA',
            mask:'##:##',
            datehappened: moment().format("YYYY-MM-DD"),
            tempSirNo: undefined,
            isloading:false,
            valid: true,
            // valid2: true,
            valid3: true,
            toSend: {},
            myData: {},
            myData2: {},
            dayloss_items:['FOR ASSESSMENT','N/A'],
            file:[],
            file2:[],
            files: [],
            classificationitems:[],
            workshiftitems:[],
            typeofreportitems:[],
            accidentdegreeitems:[],
            levelofinjuryitems:[],
            extentofinjuryitems:[],
            partsinjureditems:[],
            propertydamageditems:[],
            extentdamageitems:[],
            primetmeitems:[],
            secondarytmeitems:[],
            departmentheaditems:[],
            crrviolationitems:[],
            CivilStatusItems:[],
            GroupOfCompanies:[],
            GroupOfCompaniesnoFilter:[],
            JapaneseAdvisers:[],
            companylist:[],
            infoData:{},
            tempimage:require('../assets/NoPicture.jpg'),
            nameRules: [
                v => !!v || 'This field is required'
            ],
            dateRules: [
                v => !!v || 'This field is required',
                v => /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(v) || 'Date format : YYYY-MM-DD',
            ],
            nameRules2: [
                v => !!v || 'This field is required',
            ],
            nameRules3: [
                v => !!v || 'This field is required',
            ],
            EmployeeInfoURL:'http://hrd-adminweb/api/basicinfo',
            leadersURL:'http://hrd-adminweb:8700/api/employees',
            imageUrl:require('../assets/NoPicture.jpg'),
            imageUrl2:require('../assets/NoPicture.jpg'),
            SafetyImageURL:'//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank',
            DepartmentList: [],
            SectionList: [],
            HeadersConfig: {
            headers: {
             "master-api": "db588403f0a1d3b897442a28724166b4",
             },
            },
        }
    },
    created(){
        this.globalCompanyPath()
        this.user = store.state.SIdatabank_userInfo
        this.onload()
        // this.GetDepartments()
        // this.GetSections()
    },
    methods:{
        GetDepartments(companyCode){
            // http://10.168.69.41/api/company/department/${companyCode}   //api na bigay ni keysha
            // http://hrd-adminweb/api/employees/${companyCode}               //api sa employee master
            axios.get(`http://10.168.69.41/api/company/department/${companyCode}`,this.HeadersConfig).then(res=>{
                this.DepartmentList = res.data
                // .map(r=>{
                    // console.log(r.DepartmentName)
                //     return {
                //         DepartmentName: r.DepartmentName,
                //         DepartmentCode: r.DepartmentCode
                //     }
                // })
            })
            console.log('DepartmentList',this.DepartmentList)
         },
        //  GetDepartments(companyCode){
        //     // http://10.168.69.41/api/company/department/${companyCode}   //api na bigay ni keysha
        //     // http://hrd-adminweb/api/employees/${companyCode}               //api sa employee master
        //     axios.get(`http://hrd-adminweb/api/employees/${companyCode}`,this.HeadersConfig).then(res=>{
        //         this.DepartmentList = res.data.map(r=>{
        //             // console.log(r.DepartmentName)
        //             return {
        //                 DepartmentName: r.DepartmentName,
        //                 DepartmentCode: r.DepartmentCode
        //             }
        //         })
        //     })
        //     // console.log('DepartmentList',this.DepartmentList)
        //  },
         GetSections(currentUserCompCode,currentUserDeptCode){
        //    console.log(' this.departmentname',  this.departmentname)
           console.log('infoDATAAAAAAAAA', currentUserCompCode,currentUserDeptCode)
            axios.get(`http://hrd-adminweb/api/employees/${currentUserCompCode}/${currentUserDeptCode}`, this.HeadersConfig).then(res=>{
                this.SectionList = res.data.filter(rec=>{
                    return rec.DepartmentCode == currentUserDeptCode
                })
               
            })
            // console.log("SECTTTT",this.SectionList)
         },
         globalCompanyPath(){
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
        },
        GetPictures(val,type){
            let url = `${this.api}/uploadSingleFile`
            let formData  = new FormData
            formData.append('files',val)
            
                axios.post(url, formData, {
                    headers: {
                    "Content-Type": "multipart/form-data",
                    dataType: "json",
                    path: this.CompanyPath,
                    sirno: this.sirno,
                    type: type,
                    },
                    }).then(() => {
                })
        },
        PromiseGetSIRNo(){
            return new Promise(resolve =>{
            this.tempSIRNo = undefined

                if(this.SIdatabank_userInfo.CompanyCode == '00') { this.tempSIRNo = 'P' }
            else if(this.SIdatabank_userInfo.CompanyCode == '10') { this.tempSIRNo = 'S' }
            else if(this.SIdatabank_userInfo.CompanyCode == '20') { this.tempSIRNo = 'H' }
            else if(this.SIdatabank_userInfo.CompanyCode == '30') { this.tempSIRNo = 'R' }
            else if(this.SIdatabank_userInfo.CompanyCode == '40') { this.tempSIRNo = 'W' }
            else                                       { this.tempSIRNo = ''}

                if(this.strTypeOfReport === 1)  { this.tempSIRNo = this.tempSIRNo + 'I'}
            else if(this.strTypeOfReport === 2)  { this.tempSIRNo = this.tempSIRNo + 'A' }
            else if(this.strTypeOfReport === 3)  { this.tempSIRNo = this.tempSIRNo + 'F' }
            else if(this.strTypeOfReport === 4)  { this.tempSIRNo = this.tempSIRNo + 'L' }
            else                                 { this.tempSIRNo = ''}

                if(this.strTypeOfReport === 2 && this.strAccidentDegree === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.strTypeOfReport === 2 && this.strAccidentDegree === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.strTypeOfReport === 2 && this.strAccidentDegree === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.strTypeOfReport === 1 && this.strAccidentDegree === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.strTypeOfReport === 1 && this.strAccidentDegree === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.strTypeOfReport === 1 && this.strAccidentDegree === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.strTypeOfReport === 3 && this.strAccidentDegree === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.strTypeOfReport === 3 && this.strAccidentDegree === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.strTypeOfReport === 3 && this.strAccidentDegree === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.strTypeOfReport === 4 && this.strAccidentDegree === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.strTypeOfReport === 4 && this.strAccidentDegree === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.strTypeOfReport === 4 && this.strAccidentDegree === 3) { this.tempSIRNo = this.tempSIRNo + ''}

            if((this.strTypeOfReport === undefined || this.strTypeOfReport === null || this.strTypeOfReport === "" || this.strTypeOfReport === 0) ||
                (this.strAccidentDegree === undefined || this.strAccidentDegree === null || this.strAccidentDegree === "" || this.strAccidentDegree === 0) ||
                (this.datehappened === undefined || this.datehappened === null || this.datehappened === "" || this.datehappened === 0 || this.datehappened === moment(this.datehappened).format('YYYYMMDD')  ))
            {
                this.sirno = undefined
            }
            else
            {
                axios.get(`${this.api}/getseqno/${this.datehappened}/${this.SIdatabank_userInfo.CompanyCode}`).then (res=>{
                    let Data = res.data[0]
                    this.SeqID = Data.SeqID
                    this.sirno = this.tempSIRNo + moment(this.datehappened).format('YYYYMMDD') + '-' + Data.SeqID   
                    resolve(this.sirno)
                })
            }
            })
        },
        onFileChange(){
            this.imageUrl = URL.createObjectURL(this.file);
        },
        onFileChange2(){
            this.imageUrl2 = URL.createObjectURL(this.file2);
        },
        CRRInfoBtn(){
            this.crrdialogbox = true
        },
        ClearPictures(){
            this.file = []
            this.file2 = []
            this.imageUrl = this.tempimage
            this.imageUrl2 = this.tempimage
        },
        EmployeeInfo(){
            let tempEmployeeCode = this.EmployeeID1
            if(tempEmployeeCode != ''){
                 axios.get(`${this.EmployeeInfoURL}/${this.EmployeeID1}`).then (res =>{
                    this.infoData =  res.data[0]
                    // console.log('asdada',  this.infoData )
            if(tempEmployeeCode != '' && this.infoData != undefined){
                this.GetDepartments(this.infoData.CompanyCode);
                if(this.infoData.DepartmentCode != undefined){
                    // console.log('this.infoData.DepartmentCode', this.infoData.DepartmentCode)
                    this.GetSections(this.infoData.CompanyCode,this.infoData.DepartmentCode)
                }
            }       
            if(this.infoData == undefined || this.infoData == '' || this.EmployeeID1 == ''){
                    this.infoData = {}
                    this.employeename = ''
                    this.employeestatus = ''
                    this.position = ''
                    this.workshift = 0
                    this.gender= ''
                    this.age = 0
                    this.departmentname = ''
                    this.sectionname = ''
                    this.lengthofservice = ''
                    this.civilstatus1= 0  
                } else {
                    this.employeename = this.infoData.EmployeeName
                    this.employeestatus = this.infoData.EmployeeStatus
                    this.position = this.infoData.PositionName 
                    this.gender= this.infoData.Gender                                                                                                                                                                                                                                                                                                            
                    this.age = moment().diff(this.infoData.DateBirth,'years')
                    this.departmentname = this.infoData.DepartmentName // dating  this.infoData.DepartmentName 11/11/2022
                    this.sectionname = this.infoData.SectionName
                    // this.lengthofservice = moment().diff(this.infoData.DateHired,'years') 

                    var sdt = new Date(this.infoData.DateHired);
                    var difdt = new Date(new Date() - sdt);    
                    this.lengthofservice =  ((difdt.toISOString().slice(0, 4) - 1970) + " Y " + ' / ' + (difdt.getMonth()+1) + " M ");

                }
            })
            }else {
                    this.employeename = ''
                    this.employeestatus = ''
                    this.position = ''
                    this.workshift = 0
                    this.gender= ''
                    this.age = 0
                    this.departmentname = ''
                    this.sectionname = ''
                    this.lengthofservice = ''
                    this.civilstatus1= 0
            }
        },
        async AddRecordFinal(){
            if(this.valid == false || this.valid3 == false ||  this.datehappened == undefined || this.incidentname == '' ||  this.descriptiondetail == '' 
            //  || this.EmployeeID1 == '' || this.valid2 == false 
            ){
                this.$refs.form.validate()
                // this.$refs.form2.validate()
                this.$refs.form3.validate()
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    timer: 3000,
                    showConfirmButton: false
                })
                Toast.fire({
                    icon: 'warning',
                    title: `Please fill in all required fields!`
                })    
            }else {
                await this.PromiseGetSIRNo()
                this.myData.filename = `${this.sirno}-C.png`;
                this.myData2.filename = `${this.sirno}-E.png`;
                Swal.fire({
                    title: `Save SIR: ${this.sirno}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK'
                    }).then((result) => {
                    if (result.isConfirmed) {
                        this.descriptiondetail = this.descriptiondetail.replace(/'/g, "''")
                        this.furtherinvestigation = this.furtherinvestigation.replace(/'/g, "''")
                        this.digestconclusion = this.digestconclusion.replace(/'/g, "''")
                        this.correctiveaction = this.correctiveaction.replace(/'/g, "''")
                        this.rootanalysis = this.rootanalysis.replace(/'/g, "''")
                        this.unsafeaction = this.unsafeaction.replace(/'/g, "''")
                        this.unsafecondition = this.unsafecondition.replace(/'/g, "''")
                        this.immediateactiontaken = this.immediateactiontaken.replace(/'/g, "''")
                        this.incidentname = this.incidentname.replace(/'/g, "''")
                        this.placeofincident = this.placeofincident.replace(/'/g, "''")
                        this.AddGeneralInfo()
                        if(this.file.length === 0){
                            let url = `${this.api}/makeDirectory/${this.CompanyPath}/${this.sirno}`
                            axios.post(url).then((res) => { 
                                console.log(res) 
                            })
                            let image = { CompanyPath:this.CompanyPath, SirNo:this.sirno, image:`//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/NoPicture.jpg`, filename: this.myData.filename}
                            let copyFileURL = `${this.api}/CopyFile`
                            axios.post(copyFileURL, image).then((res) => {
                                console.log(res) 
                            })
                        }
                        else{
                            this.GetPictures(this.file,'C')
                        }

                        if(this.file2.length === 0){
                            let url = `${this.api}/makeDirectory/${this.CompanyPath}/${this.sirno}`
                            axios.post(url).then((res) => { 
                                console.log(res) 
                            })
                            let image = { CompanyPath:this.CompanyPath, SirNo:this.sirno, image:`//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/NoPicture.jpg`, filename: this.myData2.filename}
                            let copyFileURL = `${this.api}/CopyFile`
                            axios.post(copyFileURL, image).then((res) => { 
                                console.log(res) 
                            })
                        }
                        else{
                            this.GetPictures(this.file2,'E')
                            }
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top',
                            timer: 5000,
                            showConfirmButton: false
                            })
                            Toast.fire({
                            icon: 'success',
                            title: ` ${this.sirno} Saved Successfully!`
                            })    
                        this.$router.push('/records')
                        window.location.reload()
                    }
                })
            }
        },
        AddGeneralInfo(){
                this.toSend = {
                    "SeqID": this.SeqID,
                    "SirNo": this.sirno,
                    "CompanyCode": this.SIdatabank_userInfo.CompanyCode,
                    "EmployeeID": this.EmployeeID1 ,
                    "Department": this.departmentname,
                    "Section": this.sectionname,
                    "CRRID": this.crrviolation,
                    "InjuryLevelID": this.injurylevelid,
                    "DegreeofAccidentID": this.strAccidentDegree, 
                    "ReportID": this.strTypeOfReport,
                    "ClassificationID": this.classificationid,
                    "PartsInjuredID": this.partsinjured,
                    "ExtentofDamagedID": this.extentdamage,
                    "PropertyDamagedID": this.propertydamaged,
                    "PartsTME": this.partstme,
                    "PrimaryTMEID": this.primarytme,
                    "SecondaryTMEID": this.secondarytmeid,
                    "ExtentofInjuryID": this.extentinjury,
                    "CivilStausID": this.civilstatus1,
                    "ShiftID": this.workshift,
                    "DeparmentHead": this.depthead1,
                    "DepartmentAdviser": this.deptadviser1,
                    "ImmediateSuperior": this.immdtsupervisor1,
                    "NewsFlashTitle": this.incidentname,
                    "Details": this.descriptiondetail,
                    "DaysLost": this.dayloss, 
                    "DateHappened": moment(this.datehappened).format("YYYY/MM/DD"),
                    "TimeHappened": this.timepicker,
                    "NatureOfInjury": this.natureofinjury,
                    "SpecificParts": this.specificparts,
                    "ImmediateActionTaken": this.immediateactiontaken,
                    "FurtherInvestigation": this.furtherinvestigation,
                    "RootCauseAnalysis": this.rootanalysis,
                    "PictureCause": `${this.SafetyImageURL}/${this.CompanyPath}/${this.sirno}/${this.myData.filename}`,
                    "PictureEffect": `${this.SafetyImageURL}/${this.CompanyPath}/${this.sirno}/${this.myData2.filename}`,
                    "Witness1": this.witness1,
                    "Witness2": this.witness2,
                    "PlaceofIncident": this.placeofincident,
                    "DamagedCost": this.damagecost,
                    "DamageCharged": this.damagecharge,
                    "CorrectiveAction": this.correctiveaction,
                    "LengthofService": this.lengthofservice, 
                    "LengthofExposure": this.lengthofexposure,
                    "UnsafeAction": this.unsafeaction,
                    "UnsafeCondition": this.unsafecondition,
                    "Conclusion": this.digestconclusion,
                    "InvestigatedBy": this.externalofficer,
                    "SafetyTeamLeader": this.safetyleader,
                    "FSQDepartmentHead": this.fsedepthead,
                    "FSQDepartmentAdviser": this.fsedeptadviser,
                    "EmployeeAge": this.age,
                    "CreatedDate": moment().format("YYYY/MM/DD"),
                    "UpdatedDate": moment().format("YYYY/MM/DD"),
                    "UpdatedBy": this.SIdatabank_userInfo.EmployeeID
                } 
                
                console.log('toSend',this.toSend)

                const url = `${this.api}/addnewrecord` 
                axios.post(url, this.toSend).then(()=>{    
                }).catch(err=>{
                    console.log(err)
                })
        },
        PromiseCompanyList(){
            return new Promise (resolve =>{
                axios.get(`${this.api}/getcompany`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.CompanyName,
                            value : rec.CompanyCode
                        }
                    })
                    resolve(toSend)
                    
                })
            })
        },
        PromiseTypeOfReport(){
            return new Promise (resolve =>{
                axios.get(`${this.api}/getTypeOfReports`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.TypeOfReports,
                            value: rec.ReportID
                        }
                    })
                    resolve(toSend)
                    
                })
            })
        },
        PromiseAccidentDegree(){
            return new Promise (resolve=>{
                axios.get(`${this.api}/getaccidentdegree`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.AccidentDegree,
                            value: rec.AccidentDegreeID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseExtentOfInjury(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getextentofinjury`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.ExtentOfInjuries,
                            value: rec.ExtentInjuryID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseLevelOfInjury(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getinjurylevel`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.InjuryLevel,
                            value: rec.InjuryID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromisePartsInjured(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getpartsinjured`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.PartsInjuredName,
                            value: rec.PartsInjuredID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromisePropertyDamaged(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getpropertydamage`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.PropertyDamaged,
                            value: rec.PropertyDamagedID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseExtentDamage(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getextentdamage`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.ExtentofDamaged,
                            value: rec.DamagedID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseClassification(){
            return new Promise (resolve =>{
                axios.get(`${this.api}/getclassification`).then (res=>{
                    let toSend = res.data.map(rec =>{
                        return {
                            text: rec.ClassificationName,
                            value: rec.ClassificationID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseCivilStatus(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getcivilstatus`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.CiviStatus,
                            value: rec.CivilStatusID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromisePrimeTME(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getprimetme`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.PrimaryTME,
                            value: rec.PrimaryTMEID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseSecondaryTME(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getsecondarytme`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.SecondaryTME,
                            value: rec.SecondaryTMEID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        GetGroupOfCompanies(){
            axios.get(`${this.leadersURL}/${this.SIdatabank_userInfo.CompanyCode}/${this.SIdatabank_userInfo.DepartmentCode}`).then(res=>{
                this.GroupOfCompanies = res.data.map(rec1=>{
                    return{
                        text: rec1.EmployeeName,
                        value: rec1.EmployeeCode
                    }
                })
            })
        },
        GetGroupOfCompaniesnoFilter(){
            axios.get( `${this.leadersURL}/${this.SIdatabank_userInfo.CompanyCode}`).then(res=>{
                this.GroupOfCompaniesnoFilter = res.data.map(rec=>{
                    return{
                        text: rec.EmployeeName,
                        value: rec.EmployeeCode
                    }
                })
            })
        },
        PromiseGetJapaneseAdvisers(){
            return new Promise (resolve=>{
                if(this.SIdatabank_userInfo.CompanyCode === '00'){
                        this.strConvertedJapaneseCompanyCode = '000'
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '10'){
                        this.strConvertedJapaneseCompanyCode = '001'
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '20'){
                        this.strConvertedJapaneseCompanyCode = '002'
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '30'){
                        this.strConvertedJapaneseCompanyCode = '003'
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '40'){
                        this.strConvertedJapaneseCompanyCode = '004'
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '50'){
                        this.strConvertedJapaneseCompanyCode = null
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '60'){
                        this.strConvertedJapaneseCompanyCode = null
                    }
                    if(this.SIdatabank_userInfo.CompanyCode === '70'){
                        this.strConvertedJapaneseCompanyCode = null
                    }
                axios.get( `${this.api}/getJapAdvisers/${this.strConvertedJapaneseCompanyCode}`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.EmployeeName,
                            value: rec.EmployeeCode
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseCRRdetails(){
            return new Promise (resolve =>{
                axios.get(`${this.api}/getcrrviolation`).then(res =>{
                        resolve(res.data.map(rec =>{
                            return {
                                CRRID : rec.CRRID,
                                CRRDetails : rec.CRRDetails,
                                CRRSection : rec.CRRSection
                            }
                        }))
                })
            })
        },
        PromiseWorkshift(){
            return new Promise (resolve=>{
                axios.get( `${this.api}/getworkshift/${this.SIdatabank_userInfo.CompanyCode}`).then (res=>{
                    let toSend = res.data.map(rec=>{
                        return{
                            text: rec.Time,
                            value: rec.ShiftID
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        async onload(){
            try{
                this.typeofreportitems = await  this.PromiseTypeOfReport()  
                this.accidentdegreeitems = await this.PromiseAccidentDegree()
                this.levelofinjuryitems = await this.PromiseLevelOfInjury()
                this.extentofinjuryitems= await this.PromiseExtentOfInjury()
                this.partsinjureditems = await this.PromisePartsInjured()
                this.propertydamageditems = await this.PromisePropertyDamaged()
                this.extentdamageitems = await this.PromiseExtentDamage()
                this.classificationitems = await this.PromiseClassification()
                this.primetmeitems = await this.PromisePrimeTME()
                this.secondarytmeitems = await this.PromiseSecondaryTME()
                this.companylist = await this.PromiseCompanyList()
                this.CivilStatusItems = await this.PromiseCivilStatus()
                this.GetGroupOfCompaniesnoFilter()
                this.JapaneseAdvisers = await this.PromiseGetJapaneseAdvisers()
                this.crrviolationitems = await this.PromiseCRRdetails()
                this.workshiftitems = await this.PromiseWorkshift()
            }catch(err){
            console.log(err)
            }
        }
    },
    
}
</script>