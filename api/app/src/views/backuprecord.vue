<template>
    <v-main>
        <v-overlay :value="isloading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

    <v-container fluid  >
        <v-card class="mt-3">
            <v-row>
            <v-card-subtitle class='ml-7 pt-7 mr-4 ' style="font-size:20px" >Investigatory Records</v-card-subtitle> 
                <v-switch v-model="switchtable " rounded class="pt-3" style="float-right"  color='#03a89a' ></v-switch>
                    <p v-if="switchtable == true" class="mt-7" style="color:gray" >Active Records</p>
                    <p  v-else class="mt-7" style="color:gray" >Inactive Records</p>
            </v-row>
           

    <!-- Search Section -->

            <v-row class="ml-5" >

                    <v-col cols='2'  >
                        <v-text-field 
                            v-model="filtersir"
                            max-width='400px' 
                            dense label="SIR No."  
                            outlined
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2" >
                        <v-autocomplete
                            v-model="filterdepartment"
                            :items="DepartmentItems"
                            dense
                            clearable
                            label="Department" 
                            outlined
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="2" >
                        <v-autocomplete
                            v-model="filterreport"
                            :items="ReportItems"
                            dense
                            clearable
                            label="Type of Report" 
                            outlined
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="2" >
                        <v-autocomplete
                            v-model="filterdegree"
                            :items="DegreeItems"
                            dense
                            clearable
                            label="Degree" 
                            outlined
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="2">
                    <v-layout>
<!-- Search Date  -->
                        <v-text-field
                            v-model="date"
                            label="Date Happened"
                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                            v-mask="maskdate"
                            hint='YYYY-MM-DD'
                            dense
                            outlined
                        ></v-text-field>

                        </v-layout>
                        </v-col>
                            <v-col cols='1'>
                        <v-autocomplete
                            v-model='filterYear'
                            @change='yearfilter()'
                            :items="yearItems"
                            dense
                            label="Year" 
                            outlined
                        ></v-autocomplete>
                    </v-col>
                
                    <v-spacer></v-spacer>
                <!-- Add New Record Button -->

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
                                        @click="AddNewRecord()"
                                        dark
                                        absolute
                                        bottom
                                        right
                                        fab
                                        fixed >
                                    <v-icon size='32px'>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Add New Record</span>   
                            </v-tooltip>
                        </template>
            </v-row>

<!-- Data Table 1  -->      
            <v-divider ></v-divider>
            
            <v-data-table
                v-if="switchtable== true"
                dense
                :headers='tableHeader'
                :items='TableFilter'
                :page.sync="page"
                @page-count="pageCount = $event"
                hide-default-footer
                item >

<!-- Type of Report Color Code  -->

            <template v-slot:[`item.TypeOfReports`]="{ item }">
                <v-chip
                    :color="getColor(item.TypeOfReports)"
                    dark
                    small
                >{{ item.TypeOfReports }}
                </v-chip>
            </template>
            
<!-- Action Buttons  -->

            <template v-slot:[ModifierButtons()]="{item}"> 

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">                      
                        <v-icon
                            v-bind="attrs"
                            v-on="on" 
                            color='#03a89a'
                            @click="GetPictureNames(item), SirReportButton(item)" 
                            >mdi-file-document-outline</v-icon>
                    </template>
                    <span>SIR Report</span>   
                </v-tooltip>

<!-- Flash Report Button -->

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">          
                        <v-icon  
                            v-bind="attrs"
                            v-on="on" 
                            color='blue' 
                            @click="GetPictureNames(item), FlashReportButton(item)" 
                            >mdi-file-document-outline</v-icon>
                    </template>
                    <span>Flash Report</span>   
                </v-tooltip>

<!-- Edit Button -->

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon
                            v-show="SIdatabank_userInfo.UserLevel == 1 "
                            v-bind="attrs"
                            v-on="on"  
                            color='orange'
                            @click="EditReportButton(item)" 
                            >mdi-pencil-outline</v-icon>  
                    </template>
                    <span>Edit Record</span>   
                </v-tooltip>

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon
                            v-show=" SIdatabank_userInfo.UserLevel == 0 "
                            v-bind="attrs"
                            v-on="on"  
                            color='gray'
                            >mdi-pencil-off-outline</v-icon>  
                    </template>
                    <span>Unable to Edit</span>   
                </v-tooltip>


<!-- Delete Button -->

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon 
                            v-bind="attrs"
                            v-show=" SIdatabank_userInfo.UserLevel == 1"
                            v-on="on" 
                            color='red'
                            @click="tableRecordDelete(item)"
                            >mdi-delete-outline</v-icon>
                    </template>
                    <span>Delete Record</span>   
                </v-tooltip>

                

<!-- Lock/Unlock Button -->

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon 
                            @click="lockRecord(item)" 
                            v-if="item.Active == 1 " 
                            v-show="SIdatabank_userInfo.UserLevel == 1 " 
                            v-bind="attrs" 
                            v-on="on" 
                            color='#428ba7'>
                            mdi-lock-open-variant-outline
                        </v-icon>  
                        <v-icon 
                            v-else-if="item.Active == 0"
                            v-show="SIdatabank_userInfo.UserLevel == 1 "
                            @click="UnlockRecord(item)"
                            v-bind="attrs" 
                            v-on="on"  
                            color='#428ba7'>
                            mdi-lock
                        </v-icon> 
                    </template>
                    <span>{{item.Active == 1 ? 'Lock Record' : 'Unlock Record'}}</span>   
                </v-tooltip>
            </template>
            </v-data-table>

            <v-pagination
                v-if="switchtable== true"
                v-model="page"
                :length="pageCount"
                :total-visible="10"
                color='#03a89a'
                itemsPerPage= '15'
            ></v-pagination>

<!-- Data Table 2 for deleted record -->

        <v-data-table
            v-if="switchtable== false"
                dense
                :headers='tableHeader'
                :items='TableFilter2'
                :page.sync="page2"
                @page-count="pageCount2 = $event"
                hide-default-footer
                item >

<!-- Type of Report Color Code  -->

            <template v-slot:[`item.TypeOfReports`]="{ item }">
                <v-chip
                    :color="getColor(item.TypeOfReports)"
                    dark
                    small
                >{{ item.TypeOfReports }}
                </v-chip>
            </template>

<!-- Action Buttons  -->

            <template v-slot:[ModifierButtons2()]="{item}"> 

<!-- Reuse Button -->

            
                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon
                            v-show=" SIdatabank_userInfo.UserLevel == 1"
                            v-bind="attrs"
                            v-on="on" 
                            color='#03a89a'
                            @click="tableRecordReuse2(item)"
                            >mdi-recycle</v-icon>
                    </template>
                    <span>Reuse Record</span>   
                </v-tooltip>

                <v-tooltip top>        
                    <template v-slot:activator="{ on, attrs }">     
                        <v-icon
                            v-show=" SIdatabank_userInfo.UserLevel == 1"
                            v-bind="attrs"
                            v-on="on" 
                            color='red'
                            @click="deletePermanentRecord2(item)"
                            >mdi-database-remove</v-icon>
                    </template>
                    <span>Delete Permanently</span>   
                </v-tooltip>

            </template>
            </v-data-table>

            <v-pagination
                v-if="switchtable == false"
                v-model="page2"
                :length="pageCount2"
                :total-visible="10"
                color='#03a89a'
                itemsPerPage= '15'
            ></v-pagination>

        </v-card>
    </v-container>


    <template>
        <v-dialog v-model="editdialogbox1" persistent width="1400">
        <v-card height='630'> 
            <v-tabs class="fixed-tabs-bar" v-model="tab"  dark centered icons-and-text grow height="60px" background-color='#03a89a'>
                <v-tabs-slider></v-tabs-slider>
                <v-tab v-for="(item, i) in tabsHeader" :key="i" :href="`#${item.value}`" style="text-decoration: none">
                    {{item.label}} <v-icon left>{{item.icon}}</v-icon>
                </v-tab>
            </v-tabs>
            
                <v-tabs-items v-model="tab" class=" mt-2 ml-2 mr-2 pr-2 pl-2 pt-2 pb-1">
                    <v-tab-item value="1">
                    <v-card class='pa-4 MyCard1'>
                        <v-text-field
                            v-model="editItems.NewsFlashTitle"
                            label="Incident Title"
                            outlined
                            dense
                        ></v-text-field>

                        <v-row class="pt-0 mt-0" >
                            <v-col cols='3'>                 
                                <v-text-field
                                    v-model="editItems.SirNo"
                                    label="SIR No."
                                    readonly
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    v-model="editItems.DateHappened"
                                    clearable
                                    @change="GetSIRNo()"
                                    label="Date Happened"
                                    prepend-icon="mdi-calendar"
                                    outlined
                                    dense
                                    hint='YYYY-MM-DD'
                                    v-mask="maskdate"
                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                ></v-text-field>
                            </v-col> 
                            <v-col cols="2">
                                <v-text-field
                                    v-model="editItems.TimeHappened"
                                    label="Time Happened"
                                    v-mask="masktime"
                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                    hint="HH:MM AM/PM"
                                    outlined
                                    dense
                            ></v-text-field>
                            </v-col> 
                            
                            <v-col cols='2'> 
                                <v-autocomplete
                                    v-model="editItems.ReportID"
                                    :items="typeofreportitems"
                                    @change="GetSIRNo()"
                                    label="Type of Report"
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='2'> 
                                <v-autocomplete 
                                    v-model="editItems.DegreeofAccidentID"
                                    :items="accidentdegreeitems"
                                    @change="GetSIRNo()"
                                    label="Accident Degree"
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                        
                        <v-row class="pt-0 mt-0" >
                            <v-col >
                                <v-text-field
                                    v-model="editItems.PlaceofIncident"
                                    label="Place of Incident"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="3"  >
                                <v-text-field
                                    v-model ='editItems.UpdatedDate'
                                    label="Date Prepared"
                                    prepend-icon="mdi-calendar"
                                    v-mask='maskdate'
                                    hint='YYYY-MM-DD'
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col> 
                        </v-row>    

                        <v-row class="pt-0 mt-0" >
                            <v-col cols='3'> 
                                <v-autocomplete 
                                    v-model='editItems.InjuryLevelID'
                                    :items='levelofinjuryitems'
                                    label="Level of Injury"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'> 
                                <v-text-field
                                    v-model="editItems.NatureOfInjury"
                                    label="Nature of Injury"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols='4'> 
                                <v-autocomplete 
                                    v-model='editItems.ExtentofInjuryID'
                                    :items="extentofinjuryitems"
                                    label="Extent of Injury"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='2'>
                                <v-text-field
                                    v-model="editItems.DaysLost"
                                    label="Day Loss"
                                    type='number'
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>   
                        <v-row class="pt-0 mt-0">
                            <v-col cols='3'> 
                                <v-autocomplete 
                                    v-model='editItems.PartsInjuredID'
                                    :items="partsinjureditems"
                                    label="Parts Injured"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.SpecificParts"
                                    label="Specific Parts"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols='3'> 
                                <v-autocomplete 
                                    v-model='editItems.PropertyDamagedID'
                                    :items="propertydamageditems"
                                    label="Property Damage"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'> 
                                <v-autocomplete 
                                    v-model='editItems.ExtentofDamagedID'
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
                                    v-model='editItems.ClassificationID'
                                    :items="classificationitems"
                                    label="Classification"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model='editItems.PrimaryTMEID'
                                    :items="primetmeitems"
                                    label="Prime TME"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3' >
                                <v-autocomplete
                                    v-model='editItems.SecondaryTMEID'
                                    :items="secondarytmeitems"
                                    label="Secondary TME"
                                    clearable
                                    outlined
                                    dense
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.PartsTME"
                                    label="Parts of TME"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>
                </v-card>

            </v-tab-item>

        <!-- Person Involved -->

            <v-tab-item value="2">
                    <v-card class='pa-4 MyCard1'>
                        <v-row class="pt-0 mt-0" >
                            <v-col >
                                <v-text-field
                                    v-model="editItems.EmployeeID"
                                    label="Employee ID"
                                    @change="EmployeeInfo()"
                                    :hint="editItems.EmployeeID !== '' ? `Enter to Search` : ''"
                                    type="number"
                                    outlined
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="pt-0 mt-0" >  
                            <v-col cols='5'>
                                <v-text-field
                                    v-model="editItems.Name"
                                    label="Employee Name"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='2'>
                                <v-text-field
                                    v-model="editItems.Status"
                                    label="Employee Status"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.Position"
                                    label="Position"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='2'>
                                <v-text-field
                                    v-model="editItems.LengthofService"
                                    label="Length of Service (Years)"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="pt-0 mt-0">
                            <v-col cols='2'>
                                <v-autocomplete
                                    v-model="editItems.CivilStausID"
                                    :items="CivilStatusItems"
                                    label="Civil Status"
                                    outlined
                                    dense
                                    clearable
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='2'>
                                <v-text-field
                                    v-model="editItems.EmployeeAge"
                                    label="Age"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='2'>
                                <v-text-field
                                    v-model="editItems.Gender"
                                    label="Gender"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.Department"
                                    label="Department Name"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.Section"
                                    label="Section Name"
                                    outlined
                                    dense
                                    readonly
                                ></v-text-field>
                            </v-col> 
                        </v-row>

                        <v-row class="pt-0 mt-0">
                            <v-col cols='3'>
                            <v-autocomplete
                                v-model="editItems.ShiftID"
                                :items="workshiftitems"
                                label="Work Shift"
                                outlined
                                dense
                                clearable
                            ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model='editItems.DepartmentHeadCode'
                                    :items="GroupOfCompanies"
                                    label="Department Head"
                                    outlined
                                    dense
                                    clearable
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model='editItems.DepartmentAdviserCode'
                                    :items="JapaneseAdvisers"
                                    label="Department Adviser"
                                    outlined
                                    dense
                                    clearable
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model="editItems.ImmediateSuperiorCode"
                                    :items="GroupOfCompanies"
                                    label="Immediate Superior"
                                    outlined
                                    dense   
                                    clearable
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-card>
            </v-tab-item>

            <v-tab-item value='3'>
                <v-card class='pa-2 MyCard1'> 
                    <v-row class='pt-2 pb-5'>
                        <v-row>
                            <v-col  style='margin-left:100px' cols='5' align="center">
                                <v-file-input  
                                    v-model="editItems.PictureCause" 
                                    style="padding-bottom:20px;max-width:calc(100vh - 450px);min-width:calc(100vh - 450px);" 
                                    accept="image/*" 
                                    @change="onFileChange" 
                                    ></v-file-input>
                                <v-spacer></v-spacer>
                                <v-img 
                                    style="border:1px solid black ;height: 300px;width:430px"
                                    v-if="this.editItems.PictureCause !== null " :src="imageUrl">
                                </v-img>
                                <v-card-subtitle>Image Cause</v-card-subtitle>
                            </v-col>
                        
                            <v-col   style='margin-left:40px' cols='5' align="center">
                                <v-file-input  
                                    v-model="editItems.PictureEffect" 
                                    style="padding-bottom:20px; max-width:calc(100vh - 450px);min-width:calc(100vh -0px);"  
                                    accept="image/*" 
                                    @change="onFileChange2" 
                                    ></v-file-input>
                                <v-spacer></v-spacer>
                                <v-img 
                                    style="border:1px solid black ;height: 300px;width:430px"
                                    v-if="this.editItems.PictureEffect !== null " :src="imageUrl2">
                                
                                </v-img>
                                <v-card-subtitle class='pt-4'  >Image Effect</v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-card>
            </v-tab-item>
            <v-tab-item value='4'>
                <v-card class='pa-4 MyCard1'>
                    <v-row class="pt-0 mt-0">
                            <v-col cols='6'>
                                <v-text-field
                                    v-model="editItems.Witness1"
                                    label="Witness 1"
                                    outlined
                                    dense >
                                </v-text-field>
                            </v-col>
                            <v-col cols='6'>
                                <v-text-field
                                    v-model="editItems.Witness2"
                                    label="Witness 2 "
                                    outlined
                                    dense>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model="editItems.InvestigatedBy"
                                    :items='GroupOfCompaniesnoFilter'
                                    label="External Safety Officer"
                                    outlined
                                    clearable
                                    dense >
                                </v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model="editItems.SafetyTeamLeader"
                                    :items='GroupOfCompaniesnoFilter'
                                    label="Safety Team Leader/Superior"
                                    outlined
                                    clearable
                                    dense>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model="editItems.FSQDepartmentHead"
                                    :items='GroupOfCompaniesnoFilter'
                                    label="FSE Department Head"
                                    outlined
                                    clearable
                                    dense>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols='3'>
                                <v-autocomplete
                                    v-model="editItems.FSQDepartmentAdviser"
                                    :items='JapaneseAdvisers'
                                    label="FSE Department Adviser "
                                    outlined
                                    clearable
                                    dense>
                                </v-autocomplete>
                            </v-col>
                        </v-row>    
                        <v-row class="pt-0 mt-0">
                            <v-col>
                                <v-autocomplete
                                    v-model="editItems.CRRID"
                                    :items="crrviolationitems"
                                    label="CRR Violation"
                                    outlined
                                    dense
                                    clearable
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.DamagedCost"
                                    type='number'
                                    label="Damage Cost"
                                    hint='0.00 Php'
                                    suffix='Php'
                                    outlined
                                    placeholder='0.00'
                                    dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols='3'>
                                <v-text-field
                                    v-model="editItems.DamageCharged"
                                    type='number'
                                    label="Damage Charged"
                                    outlined
                                    hint='0.00 Php'
                                    suffix='Php'
                                    placeholder='0.00'
                                    dense
                                ></v-text-field>
                            </v-col>
                        </v-row>
                </v-card>
            </v-tab-item>

            <v-tab-item value='5'>
                <v-card class='pa-4 MyCard1'>

                    <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.Details"
                                    label="Description/Detail (English)"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.FurtherInvestigation"
                                    label="Further Investigation"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.Conclusion"
                                    label="Digest Conclusion"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.RootCauseAnalysis"
                                    label="Root Cause Analysis"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.CorrectiveAction"
                                    label="Corrective Actions "
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.UnsafeAction"
                                    label="Unsafe Action "
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.UnsafeCondition"
                                    label="Unsafe Condition"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row class="pt-0 mt-0">
                            <v-col class="pl-11 pr-11">
                                <v-textarea
                                    v-model="editItems.ImmediateActionTaken"
                                    label="Immediate Action Taken"
                                    outlined
                                    dense
                                    rows='4'
                                ></v-textarea>
                            </v-col>
                        </v-row>
                </v-card>
            </v-tab-item>
            
        <v-divider></v-divider>

                    <v-card-actions>
                            <v-spacer></v-spacer>
                                <v-btn @click="editdialogbox1 = false " color="#03a89a">
                                    <span style='color:#ffffff'>Cancel</span>
                                </v-btn>
                                <v-btn @click="UpdateRecord()" color="#03a89a" >
                                    <span style='color:#ffffff'>Update</span>
                                </v-btn>
                        </v-card-actions>
                    </v-tabs-items>
                </v-card>
            </v-dialog>
        </template>
    </v-main>
</template>

<script>
import moment from 'moment'
import Swal from 'sweetalert2'
import store from '@/store'
import axios from 'axios'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {mask} from 'vue-the-mask'
export default {
    directives: {mask},
    data(){
        return{
            filterYear:new Date().getFullYear(),
            tempDateHappened:'',
            fillColor:'',
            imageUrl:'',
            imageUrl2:'',
            oldTypeofReport:'',
            oldAccidentDegree:'',
            oldSIRNo: '',
            oldImageCause:'',
            oldImageEffect:'',
            EmployeeName :'',
            EmployeeStatus:'',
            Name:'',
            Status:'',
            Position : '',
            Gender: '',
            WorkShift:'',
            PictureCause:'',
            PictureEffect:'',
            date: '',
            filtersir:'',
            filterdegree:'',
            filterreport:'',
            filterdepartment:'',
            CompanyPath:'',
            search:'',
            selectcompany:'',
            departmentcode:'',
            crrdetails:'',
            crrviolation:'',
            pageCount: 0,
            page: 1,
            pageCount2: 0,
            page2: 1,
            switchtable: true,
            isloading:false,
            tab: null,
            editdialogbox1:false,
            blnDataLoad: false,
            tempSIRNo: undefined,
            CompanyFullName:'',
            editItems:{},
            Data:{},
            user:{},
            yearItems:[],
            ReportItems:[],
            DegreeItems:[],
            DepartmentItems:[],
            tableItems:[],
            tableItems2:[],
            GroupOfCompaniesnoFilter:[],
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
            crrviolationitems:[],
            CivilStatusItems:[],
            GroupOfCompanies:[],
            JapaneseAdvisers:[],
            myData:[],
            myData2:[],
            masktime:'##:## AA',
            maskdate:'####-##-##',
            tabsHeader: [
                {label: 'General Information', value: '1'},
                {label: 'Person Involved', value: '2'},
                {label: 'Illustrations / Pictures', value: '3'},
                {label: 'Witness/Cost/Violation', value: '4'},
                {label: 'Investigation Details', value: '5'}
            ],
            tableHeader:[
                {text:'SIR No.', value:'SirNo'},
                {text:'Type of Report', value:'TypeOfReports'},
                {text:'News Flash Title', value:'NewsFlashTitle'},
                {text:'Degree', value:'AccidentDegree'},
                {text:'Level', value:'InjuryLevel'},
                {text:'Date Happened', value:'DateHappened'},
                {text:'Actions', value:'action'}
            ],
            DepartmentURL:'http://hrd-adminweb/api/company/department',
            ftpPath:'http://hv12-hrd41:3001/ftp/FileServer/SafetyInvestigatoryDatabank',
            EmployeeInfoURL:'http://hrd-adminweb/api/basicinfo',
            SafetyImageURL:'//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank',
            leadersURL:'http://hrd-adminweb:8700/api/employees'
        }
    },
    created(){
        this.user = store.state.SIdatabank_userInfo
        this.onLoadData()   
        this.onLoadData2() 
        this.onload()
        this. globalCompanyPath()
        this.DepartmentSearch()
    },
    methods:{
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
        GetSIRNo(){
            this.tempSIRNo = undefined
                if(this.SIdatabank_userInfo.CompanyCode == '00') { this.tempSIRNo = 'P' }
            else if(this.SIdatabank_userInfo.CompanyCode == '10') { this.tempSIRNo = 'H' }
            else if(this.SIdatabank_userInfo.CompanyCode == '20') { this.tempSIRNo = 'S' }
            else if(this.SIdatabank_userInfo.CompanyCode == '30') { this.tempSIRNo = 'R' }
            else if(this.SIdatabank_userInfo.CompanyCode == '40') { this.tempSIRNo = 'W' }
            else                                       { this.tempSIRNo = ''}

                if(this.editItems.ReportID === 1)  { this.tempSIRNo = this.tempSIRNo + 'I'}
            else if(this.editItems.ReportID === 2)  { this.tempSIRNo = this.tempSIRNo + 'A' }
            else if(this.editItems.ReportID === 3)  { this.tempSIRNo = this.tempSIRNo + 'F' }
            else if(this.editItems.ReportID === 4)  { this.tempSIRNo = this.tempSIRNo + 'L' }
            else                                    { this.tempSIRNo = ''}

                if(this.editItems.ReportID === 2 && this.editItems.DegreeofAccidentID === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.editItems.ReportID === 2 && this.editItems.DegreeofAccidentID === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.editItems.ReportID === 2 && this.editItems.DegreeofAccidentID === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.editItems.ReportID === 1 && this.editItems.DegreeofAccidentID === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.editItems.ReportID === 1 && this.editItems.DegreeofAccidentID === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.editItems.ReportID === 1 && this.editItems.DegreeofAccidentID === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.editItems.ReportID === 3 && this.editItems.DegreeofAccidentID === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.editItems.ReportID === 3 && this.editItems.DegreeofAccidentID === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.editItems.ReportID === 3 && this.editItems.DegreeofAccidentID === 3) { this.tempSIRNo = this.tempSIRNo + ''}
                if(this.editItems.ReportID === 4 && this.editItems.DegreeofAccidentID === 1) { this.tempSIRNo = this.tempSIRNo + 'J'}
            else if(this.editItems.ReportID === 4 && this.editItems.DegreeofAccidentID === 2) { this.tempSIRNo = this.tempSIRNo + 'N'}
            else if(this.editItems.ReportID === 4 && this.editItems.DegreeofAccidentID === 3) { this.tempSIRNo = this.tempSIRNo + ''}

            if((this.editItems.ReportID === undefined || this.editItems.ReportID === null || this.editItems.ReportID === "" || this.editItems.ReportID === 0) ||
                (this.editItems.DegreeofAccidentID === undefined || this.editItems.DegreeofAccidentID === null || this.editItems.DegreeofAccidentID === "" || this.editItems.DegreeofAccidentID === 0) ||
                (this.editItems.DateHappened === undefined || this.editItems.DateHappened === null || this.editItems.DateHappened === "" || this.editItems.DateHappened === 0 || this.editItems.DateHappened === moment(this.editItems.DateHappened).format('YYYYMMDD')  ))
            {
                this.editItems.SirNo = undefined
            } else {
                axios.get(`${this.api}/getseqno/${this.editItems.DateHappened}/${this.SIdatabank_userInfo.CompanyCode}`).then (res=>{
                let Data = res.data[0]
                if(this.editItems.DateHappened !== this.tempDateHappened){
                this.editItems.SeqID = Data.SeqID
                this.editItems.SirNo = this.tempSIRNo + moment(this.editItems.DateHappened).format('YYYYMMDD') + '-' +  Data.SeqID
                } else {
                this.editItems.SirNo = this.tempSIRNo + moment(this.editItems.DateHappened).format('YYYYMMDD') + '-' +  this.editItems.SeqID
                    }
                })
            }
        },

        EmployeeInfo(){
            axios.get(`${this.EmployeeInfoURL}/${this.editItems.EmployeeID}`).then (res =>{
                if(res.data.length == []){
                    this.editItems.Name = ''
                    this.editItems.Status=''
                    this.editItems.Position =''
                    this.editItems.Gender= ''
                    this.editItems.EmployeeAge = ''
                    this.editItems.Department = ''
                    this.editItems.Section = ''
                    this.editItems.LengthofService = ''
                    this.editItems.DepartmentCode = ''
                    this.editItems.selectcompany = ''
                    this.editItems.departmentcode = ''
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        timer: 4000,
                        showConfirmButton: false
                        })
                        Toast.fire({
                        icon: 'warning',
                        title: `Employee ID doesn't exist!`
                        })   

                } else {
                res.data.map(rec =>{
                    this.editItems.Name = rec.EmployeeName
                    this.editItems.Status= rec.EmployeeStatus
                    this.editItems.Position = rec.PositionName
                    this.editItems.Gender= rec.Gender
                    this.editItems.EmployeeAge = moment().diff(rec.DateBirth,'years')
                    this.editItems.Department = rec.DepartmentName
                    this.editItems.Section = rec.SectionName
                    this.editItems.LengthofService = moment().diff(rec.DateHired,'years') 
                    this.editItems.DepartmentCode = rec.DepartmentCode
                    this.editItems.selectcompany = rec.CompanyCode
                    this.editItems.departmentcode = rec.DepartmentCode
                })
                this.GetGroupOfCompanies()
                }
            })
        },
        PromiseGetPictures(val,type){
            return new Promise(resolve=>{
            let url = `${this.api}/uploadSingleFile`
            let formData  = new FormData
            formData.append('files',val)

            axios.post(url, formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                dataType: "json",
                path:this.CompanyPath,
                sirno: this.editItems.SirNo,
                type: type,
                },
                }).then((res) => {
                    resolve(res.data)
                })
            });
        },

        GetPictureNames(data){
            const Cause = data.PictureCause
            let tmpValCause = Cause.split("/")
            this.PictureCause= tmpValCause[tmpValCause.length-1]

            const Effect = data.PictureEffect
            let tmpValEffect = Effect.split("/")
            this.PictureEffect= tmpValEffect[tmpValEffect.length-1]
        },
        onFileChange(){
            this.myData.filename = `${this.editItems.SirNo}-C.png`;
            this.imageUrl = URL.createObjectURL(this.editItems.PictureCause)
        },  
        onFileChange2(){
            this.myData2.filename = `${this.editItems.SirNo}-E.png`;
            this.imageUrl2 = URL.createObjectURL(this.editItems.PictureEffect)
        },
        ModifierButtons(){
            return `item.action`
        },
        ModifierButtons2(){
            return `item.action`
        },
        UnlockRecord(item){
            Swal.fire({
                title: `Unock ${item.SirNo}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = `${this.api}/unlock`
                        axios.post(url, item).then(()=>{
                        Swal.fire(
                        'Unlocked!',
                        `${item.SirNo} has been unlocked`,
                        'success'
                        )
                    })
                    setTimeout(() => {
                        this.onLoadData()
                    }, 500);
                }
            })
        },
        lockRecord(item){
            Swal.fire({
                title: `Lock ${item.SirNo}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = `${this.api}/lock`
                        axios.post(url, item).then(()=>{
                        Swal.fire(
                        'Locked!',
                        `${item.SirNo} has been locked`,
                        'success'
                        )
                    })
                    setTimeout(() => {
                        this.onLoadData()
                    }, 500);
                }
            })
        },

        getColor(TypeOfReports){
            if (TypeOfReports ==  'Fire Incident') return 'orange'
            else if (TypeOfReports ==  'Incident') return 'green'
            else if (TypeOfReports ==  'Accident') return 'red'
            else return '#702963'
        },

        // to Add Record Page
        AddNewRecord(){
            this.$router.push('/addrecord')
        },
        yearfilter(){
            this.isloading = true
            axios.get(`${this.api}/getTableData/${this.SIdatabank_userInfo.CompanyCode}/${this.filterYear}`).then (res =>{
            this.tableItems = res.data
            this.isloading = false
            })
        },
        async onLoadData(){
                this.isloading = true
                    await axios.get(`${this.EmployeeInfoURL}/${this.SIdatabank_userInfo.EmployeeID}`).then(res=>{
                    this.CompanyFullName = res.data[0].CompanyName
                    })  
                    await axios.get(`${this.api}/getTableData/${this.SIdatabank_userInfo.CompanyCode}/${this.filterYear}`).then (res =>{
                    this.tableItems = res.data
                this.isloading = false
                    this.tableItems.forEach(Item => {
                    Item.CompanyName = this.CompanyFullName
                    let EmployeeID = Item.EmployeeID
                    if(EmployeeID != null && EmployeeID != undefined && EmployeeID != "" && EmployeeID != " "){
                        axios.get(`${this.EmployeeInfoURL}/${EmployeeID}`).then (res =>{
                            let EmployeeData = res.data[0]
                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                let Position = EmployeeData.DesignationName
                                let Status = EmployeeData.EmployeeStatus
                                let Gender = EmployeeData.Gender

                                if(Name != null || Name != undefined || Name != ""){
                                    Item.Name = Name
                                    Item.Position = Position
                                    Item.Status = Status
                                    Item.Gender = Gender
                                }
                            }
                        })
                    }
    
                    let DepartmentHeadCode = Item.DepartmentHeadCode
                    let ImmediateSuperiorCode = Item.ImmediateSuperiorCode
                    let DepartmentAdviserName = Item.DepartmentAdviserName
                    let InvestigatorCode = Item.InvestigatedBy
                    let SafetyTeamLeaderCode = Item.SafetyTeamLeader
                    let FSQDepartmentHeadCode = Item.FSQDepartmentHead
                    let FSQDepartmentAdviserName = Item.FSQDepartmentAdviserName

                    if(DepartmentHeadCode != null && DepartmentHeadCode != undefined && DepartmentHeadCode != "" && DepartmentHeadCode != " "){
                        axios.get(`${this.EmployeeInfoURL}/${DepartmentHeadCode}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.DepartmentHead = Name
                                }
                            }
                        })
                    }
                    if(ImmediateSuperiorCode != null && ImmediateSuperiorCode != undefined && ImmediateSuperiorCode != "" && ImmediateSuperiorCode != " "){
                        axios.get(`${this.EmployeeInfoURL}/${ImmediateSuperiorCode}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.ImmediateSuperior = Name
                                }
                            }
                        })
                    }
                    if(DepartmentAdviserName != null && DepartmentAdviserName != undefined && DepartmentAdviserName != "" && DepartmentAdviserName != " "){
                        axios.get(`${this.EmployeeInfoURL}/${DepartmentAdviserName}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.DepartmentAdviserName = Name
                                }
                            }
                        })
                    }
                    if(InvestigatorCode != null && InvestigatorCode != undefined && InvestigatorCode != "" && InvestigatorCode != " "){
                        axios.get(`${this.EmployeeInfoURL}/${InvestigatorCode}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.InvestigatorCode = Name
                                }
                            }
                        })
                    }
                    if(SafetyTeamLeaderCode != null && SafetyTeamLeaderCode != undefined && SafetyTeamLeaderCode != "" && SafetyTeamLeaderCode != " "){
                        axios.get(`${this.EmployeeInfoURL}/${SafetyTeamLeaderCode}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.SafetyTeamLeaderCode = Name
                                }
                            }
                        })
                    }
                    if(FSQDepartmentHeadCode != null && FSQDepartmentHeadCode != undefined && FSQDepartmentHeadCode != "" && FSQDepartmentHeadCode != " "){
                        axios.get(`${this.EmployeeInfoURL}/${FSQDepartmentHeadCode}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.FSQDepartmentHeadCode = Name
                                }
                            }
                        })
                    }
                    if(FSQDepartmentAdviserName != null && FSQDepartmentAdviserName != undefined && FSQDepartmentAdviserName != "" && FSQDepartmentAdviserName != " "){
                        axios.get(`${this.EmployeeInfoURL}/${FSQDepartmentAdviserName}`).then (res =>{
                            let EmployeeData = res.data[0]

                            if(EmployeeData != {} && EmployeeData != null && EmployeeData != undefined){
                                let Name = EmployeeData.EmployeeName
                                if(Name != null || Name != undefined || Name != ""){
                                    Item.FSQDepartmentAdviserName = Name
                                }
                            }
                        })
                    }
                })
            })
        },
        onLoadData2(){
            this.isloading = true
            axios.get(`${this.api}/getTableData2/${this.SIdatabank_userInfo.CompanyCode}`).then (res =>{
            this.tableItems2 = res.data
            })
            this.isloading = false
        },
        tableRecordDelete(item){
            Swal.fire({
                title: `Remove ${item.SirNo}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    let url = `${this.api}/deleteemployee`
                    axios.post(url, item).then(()=>{
                    Swal.fire(
                    'Removed!',
                    `${item.SirNo} has been moved to Inactive Records`,
                    'success'
                    )
                    this.onLoadData()
                    this.onLoadData2()
                    })
                }
            })
        },  
        tableRecordReuse2(item){
            Swal.fire({
                title: `Activate ${item.SirNo}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    let url = `${this.api}/reuserecord`
                    axios.post(url, item).then(()=>{
                    Swal.fire(
                    'Activated!',
                    `${item.SirNo} has been moved to Active Records`,
                    'success'
                    )
                    this.onLoadData()
                    this.onLoadData2()
                    })
                }
            })
        },  
        deletePermanentRecord2(item){
            Swal.fire({
                title: `Delete ${item.SirNo}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    let urlDelete = `${this.api}/deleteDirectory/${this.CompanyPath}/${item.SirNo}`
                        axios.post(urlDelete,item).then(() => {})
                    let url = `${this.api}/deleterecord`
                    axios.post(url, item).then(()=>{
                    Swal.fire(
                    'Deleted!',
                    `${item.SirNo} has been deleted`,
                    'success'
                    )
                    this.onLoadData()
                    this.onLoadData2()
                    })
                }
            })
        },
        CopyCauseImage(){
            let copyFileURL = `${this.api}/CopyFile`
            let image = {
                CompanyPath:this.CompanyPath, 
                SirNo:this.editItems.SirNo, 
                image:this.editItems.PictureCause, 
                filename: this.myData.filename
            }
            axios.post(copyFileURL, image).then(() => { })
        },
        CopyEffectImage(){
            let copyFileURL = `${this.api}/CopyFile`
            let image2 = {   
                            CompanyPath:this.CompanyPath, 
                            SirNo:this.editItems.SirNo, 
                            image:this.editItems.PictureEffect,
                            filename: this.myData2.filename
                        }
            axios.post(copyFileURL, image2).then(() => { })

        },
        async UpdateRecord(){
            this.editItems.Details = this.editItems.Details.replace(/'/g, "''")
            this.editItems.FurtherInvestigation = this.editItems.FurtherInvestigation.replace(/'/g, "''")
            this.editItems.Conclusion = this.editItems.Conclusion.replace(/'/g, "''")
            this.editItems.CorrectiveAction = this.editItems.CorrectiveAction.replace(/'/g, "''")
            this.editItems.RootCauseAnalysis = this.editItems.RootCauseAnalysis.replace(/'/g, "''")
            this.editItems.UnsafeAction = this.editItems.UnsafeAction.replace(/'/g, "''")
            this.editItems.UnsafeCondition = this.editItems.UnsafeCondition.replace(/'/g, "''")
            this.editItems.ImmediateActionTaken = this.editItems.ImmediateActionTaken.replace(/'/g, "''")
            this.editItems.NewsFlashTitle = this.editItems.NewsFlashTitle.replace(/'/g, "''")
            this.editItems.PlaceofIncident = this.editItems.PlaceofIncident.replace(/'/g, "''")
            this.editItems.oldSIRNo = this.oldSIRNo
            this.editItems.UpdatedBy = this.SIdatabank_userInfo.EmployeeID
            this.myData.filename = `${this.editItems.SirNo}-C.png`
            this.myData2.filename = `${this.editItems.SirNo}-E.png`

                if(this.tempDateHappened !== this.editItems.DateHappened){

                    let url = `${this.api}/makeDirectory/${this.CompanyPath}/${this.editItems.SirNo}`
                    axios.post(url).then(() => { })

                    if(this.oldImageCause !== this.editItems.PictureCause){
                        await this.PromiseGetPictures(this.editItems.PictureCause,'C')
                    }
                    else if(this.oldImageCause === this.editItems.PictureCause){
                        this.CopyCauseImage()
                    }
                    if(this.oldImageEffect !== this.editItems.PictureEffect){
                        await this.PromiseGetPictures(this.editItems.PictureEffect,'E')
                    }
                    else if(this.oldImageEffect === this.editItems.PictureEffect){
                        this.CopyEffectImage()
                    }

                }
                
                if(this.tempDateHappened === this.editItems.DateHappened){
                    if(this.oldImageCause !== this.editItems.PictureCause){
                            await this.PromiseGetPictures(this.editItems.PictureCause,'C')
                            
                        }
                        else if(this.oldImageCause === this.editItems.PictureCause){
                            this.CopyCauseImage()
                    }
                        if(this.oldImageEffect !== this.editItems.PictureEffect){
                            await this.PromiseGetPictures(this.editItems.PictureEffect,'E')

                    }
                        else if(this.oldImageEffect === this.editItems.PictureEffect){
                            this.CopyEffectImage()
                    }
                }
                    this.editItems.PictureCause = `${this.SafetyImageURL}/${this.CompanyPath}/${this.editItems.SirNo}/${this.editItems.SirNo}-C.png`
                    this.editItems.PictureEffect =  `${this.SafetyImageURL}/${this.CompanyPath}/${this.editItems.SirNo}/${this.editItems.SirNo}-E.png`  
                    Swal.fire({
                        title: `Update SIR record ${this.editItems.SirNo}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK'
                        }).then((result) => {
                        if (result.isConfirmed) {
                            if(this.tempDateHappened !== this.editItems.DateHappened ){ 
                                let urlDelete = `${this.api}/deleteDirectory/${this.CompanyPath}/${this.oldSIRNo}`
                                axios.post(urlDelete).then(() => { })
                            }
                            if(this.oldTypeofReport !== this.editItems.ReportID || this.oldAccidentDegree !== this.editItems.DegreeofAccidentID){ 
                                let urlDelete = `${this.api}/deleteDirectory/${this.CompanyPath}/${this.oldSIRNo}`
                                axios.post(urlDelete).then(() => { })
                            }
                        const url = `${this.api}/updatesafetyrecords`
                        axios.post(url, this.editItems).then(()=>{
                        this.onLoadData() 
                        this.editdialogbox1 = false 
                        window.location.reload()
                    })
                }
            })
        },

        EditReportButton(item){
            this.isloading = true
            this.oldTypeofReport = item.ReportID
            this.oldAccidentDegree = item.DegreeofAccidentID
            this.tempDateHappened = item.DateHappened
            this.oldImageCause = item.PictureCause
            this.oldImageEffect = item.PictureEffect
            this.oldSIRNo = item.SirNo
            const Cause = item.PictureCause
            let tmpValCause = Cause.split("/")
            this.editItems.PictureCause= tmpValCause[tmpValCause.length-1]
            const Effect = item.PictureEffect
            let tmpValEffect = Effect.split("/")
            this.editItems.PictureEffect= tmpValEffect[tmpValEffect.length-1]
            this.imageUrl=  `${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.editItems.PictureCause}`
            this.imageUrl2=  `${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.editItems.PictureEffect}`
            this.editItems = Object.assign({},item)
            this.EmployeeInfo()
            this.isloading = false
            this.editdialogbox1 = true
        },
        DepartmentSearch(){
                axios.get(`${this.DepartmentURL}/${this.CompanyPath}`).then (res => {
                this.DepartmentItems = res.data.filter(departments=>{
                    return departments.DeletedDate == null
                }).map(rec=>{
                    return rec.DepartmentName
                })
            })
        },

        PromiseDegreeSearch(){
            return new Promise(resolve => {
                axios.get(`${this.api}/getaccidentdegree`).then (res =>{
                    let toSend = res.data.map(rec=>{
                        return {
                            value: rec.AccidentDegreeID,
                            text: rec.AccidentDegree
                        }
                    })
                    resolve(toSend)
                })
            })
        },
        PromiseReportSearch(){
            return new Promise(resolve => {
                axios.get(`${this.api}/getTypeOfReports`).then (res =>{
                    let toSend = res.data.map(rec=>{
                        return {
                            value: rec.ReportID,
                            text: rec.TypeOfReports
                        }
                    })
                    resolve(toSend )
                })
            })
        },
        async onload(){
            try{
                this.isloading= true
                this.yearItems = await this.PromiseGetYear();
                this.DegreeItems = await this.PromiseDegreeSearch();
                this.ReportItems = await this.PromiseReportSearch();
                this.typeofreportitems = await  this.PromiseTypeOfReport();
                this.accidentdegreeitems = await this.PromiseAccidentDegree();
                this.levelofinjuryitems = await this.PromiseLevelOfInjury();
                this.extentofinjuryitems= await this.PromiseExtentOfInjury();
                this.partsinjureditems = await this.PromisePartsInjured();
                this.propertydamageditems = await this.PromisePropertyDamaged();
                this.extentdamageitems = await this.PromiseExtentDamage();
                this.classificationitems = await this.PromiseClassification();
                this.primetmeitems = await this.PromisePrimeTME();
                this.secondarytmeitems = await this.PromiseSecondaryTME();
                this.CivilStatusItems = await this.PromiseCivilStatus();
                this.GetGroupOfCompaniesnoFilter()
                this.JapaneseAdvisers = await this.PromiseGetJapaneseAdvisers();
                this.crrviolationitems = await this.PromiseGetCRRViolation();
                this.workshiftitems = await this.PromiseWorkshift();
                this.isloading=false
            }catch(err){    
                console.log(err)        
            }
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
            axios.get( `${this.leadersURL}/${this.editItems.selectcompany}/${this.editItems.departmentcode}`).then(res=>{
                this.GroupOfCompanies = res.data.map(rec=>{
                    return{
                        text: rec.EmployeeName,
                        value: rec.EmployeeCode
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

        PromiseGetCRRViolation(){
            return new Promise (resolve =>{
                axios.get(`${this.api}/getcrrviolation`).then(res =>{
                        resolve(res.data.map(rec =>{
                            return {
                                text : rec.CRRDetails,
                                value : rec.CRRID
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

        PromiseGetYear(){
            return new Promise(resolve =>{
                axios.get(`${this.api}/getyear/${this.SIdatabank_userInfo.CompanyCode}`).then(res=>{
                    let toSend = res.data.map(rec=>{
                        return {
                            text: rec.Year 
                        }
                    })
                        resolve(toSend)
                })
            })
        },

        async SirReportButton(item){

            var SIRReport = {
                
                pageMargins: [ 20, 20, 20, 25 ],
                content: [
                {        
                table : {
                    headerRows : 1,
                    widths: [555],
                    body : [
                            [''],
                            ['']
                            ]
                    },
                    layout : 'headerLineOnly'
                    },

                    {   text: item.CompanyName,
                        border: [false, true, false, false],
                        fontSize: 9,
                        alignment:'center'
                    },



                    {   text: 'Safety Investigatory Report \n',
                        border: [false, false, false, true],
                        bold: true,
                        fontSize: 17,
                        alignment:'center',
                        italics:'true'
                },
                {
                            
                table : {
                    headerRows : 1,
                    widths: [555],
                    body : [
                            [''],
                            ['\n']
                            ]
                    },
                    layout : 'headerLineOnly'
                    },
                    
                    

                            {   text: 'I. General Information:\n ', 
                                style: 'header',
                                fontSize: 12,
                            
                            },

                            {
                                columns:
                                [{
                                    text:'SIR No                       :',
                                    margin:[11,5,0,
                                    ], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.SirNo}`,
                                    bold: true,
                                    margin:[-179,5,0,0], 
                                    italics: true,
                                    fontSize:9
                                },]
                            },

                            {
                                columns:
                                [{
                                    text:'Date of Incident       :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.DateHappened != null || item.DateHappened != undefined ? item.DateHappened : ""}     ${item.TimeHappened != null || item.TimeHappened != undefined ? item.TimeHappened : ""}`,
                                    bold: true,
                                    margin:[-40,5,0,0], 
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Location                      :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.PlaceofIncident.replace(/''/g, "'") != null || item.PlaceofIncident.replace(/''/g, "'") != undefined ? item.PlaceofIncident : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Degree of Accident :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.AccidentDegree != null || item.AccidentDegree != undefined ? item.AccidentDegree : ""}`,
                                    italics: true,
                                    bold: true,
                                    margin:[-40,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:'Level                            :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.InjuryLevel != null || item.InjuryLevel != undefined ? item.InjuryLevel : ""}       Day Lost: ${item.DaysLost != null || item.DaysLost != undefined ? item.DaysLost : ""} `,
                                    italics: true,
                                    bold: true,
                                    margin:[-67,5,0,0], 
                                    fontSize:9
                                }]
                            },
                            {
                                columns:
                                [{
                                    text:'EmployeeName       :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.EmployeeID}   ${item.Name != null || item.Name != undefined ? item.Name : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Department & Section  :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.Department != null || item.Department != undefined ? item.Department : ""} - ${item.Section != null || item.Section != undefined ? item.Section : ""}`,
                                    margin:[-60,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Employee Status     :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.Status != null || item.Status != undefined ? item.Status : ""}    Position:   ${item.Position != null || item.Position != undefined ? item.Position : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Length of Service      :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.LengthofService != null || item.LengthofService != undefined ? item.LengthofService : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Gender                      :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },

                                {

                                    text:`${item.Gender != null || item.Gender != undefined ? item.Gender : "" }    Age:  ${item.EmployeeAge != null || item.EmployeeAge != undefined ? item.EmployeeAge : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Length of Exposure   :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.LengthofExposure != null || item.LengthofExposure != undefined ? item.LengthofExposure : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Nature of Injury       :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.NatureOfInjury != null || item.NatureOfInjury != undefined ? item.NatureOfInjury : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Extent of Injuries       :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.ExtentOfInjuries != null || item.ExtentOfInjuries != undefined ? item.ExtentOfInjuries : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Body Parts Injured  :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.PartsInjuredName != null || item.PartsIjurnedName != undefined ? item.PartsInjuredName : ""} `,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Primary TME              :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.PrimaryTME != null || item.PrimaryTME != undefined ? item.PrimaryTME : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {   
                                columns:
                                [{
                                    text:'Specific Parts          :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.SpecificParts != null || item.SpecificParts != undefined ? item.SpecificParts : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Parts TME                  :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.PartsTME != null || item.PartsTME != undefined ? item.PartsTME : ""}`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Unsafe Action          :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.UnsafeAction != null || item.UnsafeAction != undefined ? item.UnsafeAction : ""}`,
                                    margin:[-40,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Unsafe Condition      :',
                                    margin:[-20,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.UnsafeCondition != null || item.UnsafeCondition != undefined ? item.UnsafeCondition : ""} \n \n \n`,
                                    margin:[-68,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },
                            
                            {   text: 'II. Description/Details of the Incident:\n', 
                                style: 'header',
                                fontSize: 12,
                            
                            },
                            {
                                    text:`${item.Details != null || item.Details.replace(/''/g, "'") != undefined ? item.Details.replace(/''/g, "'") : ""} \n \n`,
                                    margin:[11,11,11,0], 
                                    alignment: 'justify',
                                    italics: true,
                                    fontSize:10
                                },
                                {
                                    columns:[
                                        
                                {
                                    image: await this.getBase64ImageFromURL(`${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.PictureCause}`) ,
                                    margin:[50,0,0,0],
                                    width: 200,
                                    height: 155
                                },

                                {
                                    image: await this.getBase64ImageFromURL(`${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.PictureEffect}`),
                                    margin:[104,0,0,0],
                                    width: 200,
                                    height: 155
                                }]

                                },

                                {
                                    text:'Immediate Action Taken',
                                    margin:[5,17,0,0],
                                    fontSize: 11,   
                                    italics: true,
                                },
                                {
                                    text:`${item.ImmediateActionTaken.replace(/''/g, "'") != null || item.ImmediateActionTaken.replace(/''/g, "'") != undefined ? item.ImmediateActionTaken : ""} \n\n`,
                                    margin:[11,9,0,5],
                                    fontSize:10
                                },
                                {
                                    text:'Further Investigation',
                                    fontSize: 11,
                                    margin:[5,0,0,0],
                                    italics: true,
                                },
                                {
                                    text:`${item.FurtherInvestigation.replace(/''/g, "'") != null || item.FurtherInvestigation.replace(/''/g, "'") != undefined ? item.FurtherInvestigation : ""} \n\n`,
                                    alignment: 'justify',
                                    margin:[11,9,0,5],
                                    fontSize:10
                                },
                                {
                                    text:'III. Root Cause Analysis',
                                    margin:[5,0,0,0],
                                    style: 'header',
                                    fontSize: 11,   
                                    bold: true,
                                },
                                {
                                    text:`${item.RootCauseAnalysis.replace(/''/g, "'") != null || item.RootCauseAnalysis.replace(/''/g, "'") != undefined ? item.RootCauseAnalysis : ""} \n\n`,
                                    margin:[11,9,0,5],
                                    italics: true,
                                    fontSize:10
                                },
                                {
                                    text:'IV. Corrective Action',
                                    margin:[5,0,0,0],
                                    style: 'header',
                                    fontSize: 11,   
                                    bold: true,
                                },
                                {
                                    text:`${item.CorrectiveAction.replace(/''/g, "'") != null || item.CorrectiveAction.replace(/''/g, "'") != undefined ? item.CorrectiveAction : ""} \n\n`,
                                    margin:[11,9,0,5],
                                    italics: true,
                                    fontSize:10
                                },
                                {
                                    text:'V. Digest/Conclusion',
                                    margin:[5,0,0,0],
                                    style: 'header',
                                    fontSize: 11,   
                                    bold: true,
                                },
                                {
                                    text:`${item.Conclusion.replace(/''/g, "'") != null || item.Conclusion.replace(/''/g, "'") != undefined ? item.Conclusion : ""}\n\n\n\n\n\n`,
                                    margin:[11,9,0,15],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                {
                                    canvas: [
                                    {
                                        type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 2,
                                    }]
                                },

                                {

                            columns:[{

                                    text:``,
                                    margin:[0,40,0,0],

                                },
                                ]

                            },
                            {
                            columns:[{

                                    text:`Investigated by:                   ${item.InvestigatorCode != null || item.InvestigatorCode != undefined ? item.InvestigatorCode : ""}`,
                                    margin:[15,9,0,0],
                                    fontSize: 10,   
                                    italics: true,

                                },
                                {
                                    text:`Checked by:                        ${item.SafetyTeamLeaderCode != null || item.SafetyTeamLeaderCode != undefined ? item.SafetyTeamLeaderCode : ""}`,
                                    margin:[10  ,9,0,0],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                ]

                            },
                            {
                                columns:[{

                                    text:` `+` `+` `+` `+` `+   ` `+` `+` `+` `+` `+` `+` `+ `External Safety Officer ` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `,
                                    margin:[125,0,0,30],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                },
                                {
                                    text:` `+` `+` `+` `+` `+` `+` `+`  `+`  `+`  `+`  `+` `+`   Safety Team Leader` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `,
                                    margin:[115,0,0,30],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                }
                                ]

                            },
                            {
                            columns:[{

                                    text:`Approved by:                       ${item.DepartmentHead != null || item.DepartmentHead != undefined ? item.DepartmentHead : ""}`,
                                    margin:[11,9,0,0],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                {
                                    text:`Approved by:                      ${item.FSQDepartmentHeadCode != null || item.FSQDepartmentHeadCode != undefined ? item.FSQDepartmentHeadCode : ""}`,
                                    margin:[0,9,0,0],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                ]

                            },
                            {
                                columns:[{

                                    text: ` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+`Department Head` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `,
                                    margin:[135,0,0,30],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                },
                                {
                                    text:` `+` `+` `+` `+   ` `+` `+` `+` `+` `+   ` `+` `+` `+` `+` `+` `+` `+`FSE Department Head` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+  ` `+ ` `+ ` `,
                                    margin:[110,0,0,30],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                }
                                ]

                            },
                            {
                            columns:[{
                                    text:`       ${item.DepartmentAdviserName != null || item.DepartmentAdviserName != undefined ? item.DepartmentAdviserName : ""}`,
                                    margin:[130,9,0,0],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                {
                                    text:`   ${item.FSQDepartmentAdviserName != null || item.FSQDepartmentAdviserName != undefined ? item.FSQDepartmentAdviserName : ""}`,
                                    margin:[120,9,0,0],
                                    fontSize: 10,   
                                    italics: true,
                                },
                                ]

                            },

                            {
                                columns:[{

                                    text:` `+` `+` `+` `+  ` `+` `+` `+` `+` `+  ` `+` `+` `+` `+` `+` `+` `+`Department Adviser` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `,
                                    margin:[130,0,0,30],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                },
                                {
                                    text:` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+` `+`FSE Department Adviser` + ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `+ ` `,
                                    margin:[105,0,0,20],
                                    fontSize: 10,   
                                    decoration: 'overline',

                                }
                                ]

                            },
                            {
                                    text:`Remarks:`,
                                    margin:[11,20,0,0],
                                    fontSize: 10,   

                                },
                            ],
                            
                            
                            footer:  function (currentPage) {

                            return { 
                                
                                table: { 
                                    body: [
                                        [{
                                                text:  item.CompanyName, 
                                                margin:[27,0,0,50],
                                                fontSize: 10,
                                                italics: 'true'
                                            },
                                            

                                            {
                                                text: `Safety Investigatory Report:  ${item.SirNo}`, 
                                                fontSize: 10,
                                                italics: 'true'
                                            },
                                            
                                            {
                                                text: "Page " + currentPage.toString() ,
                                                fontSize: 10,
                                                margin:[195,0,0,0]
                                            }]
                                    ]
                                },
                                layout: 'noBorders'
                            };
                        },
                            
                            
                                styles: {
                                header: {
                                fontSize: 18,
                                bold: true
                            },
                                bigger: {
                                fontSize: 15,
                                italics: true
                            },

                        }   
                }
                pdfMake.createPdf(SIRReport).open();
            },
            




        async FlashReportButton(item){

            var FlashReport = {
                pageMargins: [ 20, 30, 20, 25 ],
                content: [
                {
                    style: 'section',
                        table: {
                            widths: [ '100%'],
                            body: [
                                [ 
                                    {
                                    text: 'SAFETY BULLETIN ',
                                    fontSize: 17,
                                    color:'#ffffff',
                                    fillColor: `${item.ReportID == 1 ? '#03ac13':'' || item.ReportID == 2  ?  '#e9534f': '' ||  item.ReportID == 3  ?  '#ed7014': '' ||  item.ReportID == 4  ?  '#702963': ''} `,
                                    bold: true,
                                    margin:[0,6,0,0],
                                    italics:'true',
                                    alignment: 'center'
                                    
                                    },
                                ]
                            ]
                        },
                        layout: 'noBorders'
                    },
                    {
                    style: 'section',
                        table: {
                            widths: [ '100%'],
                            body: [
                                [ 
                                    {
                                    text: item.CompanyName,
                                    fontSize: 9,
                                    color:'#ffffff',
                                    fillColor: `${item.ReportID == 1 ? '#03ac13':'' || item.ReportID == 2  ?  '#e9534f': '' ||  item.ReportID == 3  ?  '#ed7014': '' ||  item.ReportID == 4  ?  '#702963': ''} `,
                                    bold: true,
                                    margin:[0,-5,0,6],
                                    alignment: 'center'
                                    
                                    },
                                ]
                            ]
                        },
                        layout: 'noBorders'
                    },

                    {
                            
                table : {
                    headerRows : 1,
                    widths: [555],
                    body : [
                            [''],
                            ['']
                            ]
                    },
                    layout : 'headerLineOnly'
                    },
                    {
                            
                table : {
                    headerRows : 1,
                    widths: [555],
                    body : [
                            [''],
                            ['']
                            ]
                    },
                    layout : 'headerLineOnly'
                    },

                    
                    
                    

                    {   
                        text:`${item.NewsFlashTitle.replace(/''/g, "'")} `,
                        border: [false, true, false, false],
                        color:'blue',
                        margin:[0,9,0,9], 
                        fontSize: 17,
                        alignment:'center',
                        bold: true,
                        italics:'true'
                    },
                    {
                            
                table : {
                    headerRows : 1,
                    widths: [555],
                    body : [
                            [''],
                            ['']
                            ]
                    },
                    layout : 'headerLineOnly'
                    },

                            {
                                columns:
                                [{
                                    text:'SIR No                           :',
                                    margin:[11,15,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.SirNo}`,
                                    bold: true,
                                    margin:[-35,15,0,0], 
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Date Happened    :',
                                    margin:[0,15,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.DateHappened != null || item.DateHappened != undefined ? item.DateHappened : ""}     ${item.TimeHappened != null || item.TimeHappened != undefined ? item.TimeHappened : ""}`,
                                    margin:[-60,15,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Type of Incident          :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.TypeOfReports != null || item.TypeOfReports != undefined ? item.TypeOfReports : ""}`,
                                    bold: true,
                                    margin:[-35,5,0,0], 
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Level                      :',
                                    margin:[0,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.InjuryLevel != null || item.InjuryLevel != undefined ? item.InjuryLevel : ""}       Day Lost: ${item.DaysLost != null || item.DaysLost != undefined ? item.DaysLost : ""} `,
                                    italics: true,
                                    bold: true,
                                    margin:[-60,5,0,0], 
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Employee ID/Status   :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.EmployeeID}      Position:   ${item.Position != null || item.Position != undefined ? item.Position : ""}`,
                                    margin:[-35,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Department          :',
                                    margin:[0,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.Department != null || item.Department != undefined ? item.Department : ""}`,
                                    italics: true,
                                    bold: true,
                                    margin:[-60,5,0,0], 
                                    fontSize:9
                                }]
                            },
                            {
                                columns:
                                [{
                                    text:'Department Head       :',
                                    margin:[11,5,0,0], 
                                    fontSize:9
                                },
                                {

                                    text:`${item.DepartmentHead != null || item.DepartmentHead != undefined ? item.DepartmentHead : ""}`,
                                    margin:[-35,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Section                  :',
                                    margin:[0,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.Section != null || item.Section != undefined ? item.Section : ""}`,
                                    margin:[-60,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },

                            {
                                columns:
                                [{
                                    text:'Department Adviser   :',
                                    margin:[11,5,0,15], 
                                    fontSize:9
                                },
                                {

                                    text: `${item.DepartmentAdviserName != null || item.DepartmentAdviserName != undefined ? item.DepartmentAdviserName : ""}`,
                                    margin:[-35,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                },
                                {
                                    text:'Imm. Superior      :',
                                    margin:[0,5,0,0], 
                                    fontSize:9
                                },
                                {
                                    text:`${item.ImmediateSuperior != null || item.ImmediateSuperior != undefined ? item.ImmediateSuperior : ""}`,
                                    margin:[-60,5,0,0], 
                                    bold: true,
                                    italics: true,
                                    fontSize:9
                                }]
                            },  

                            
                            {   text: 'II. Description/Details of the Incident:\n', 
                                style: 'header',
                                fontSize: 10,
                            
                            },
                            {
                                    text:`${item.Details}\n \n`,
                                    margin:[11,11,11,10], 
                                    alignment: 'justify',
                                    bold:true,
                                    italics: true,
                                    fontSize:12
                                },

                                {
                                    columns:[
                                        
                                {
                                    image: await this.getBase64ImageFromURL(`${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.PictureCause}`)  ,
                                    margin:[50,0,0,40],
                                    width: 200,
                                    height: 155
                                },

                                {
                                    image: await this.getBase64ImageFromURL(`${this.ftpPath}/${this.CompanyPath}/${item.SirNo}/${this.PictureEffect}`)  ,
                                    margin:[104,0,0,20],
                                    width: 200,
                                    height: 155
                                }]

                                },
                                {
                            
                                table : {
                                    headerRows : 1,
                                    widths: [555],
                                    body : [
                                            [''],
                                            ['\n']
                                            ]
                                    },
                                    layout : 'headerLineOnly'
                                    },
                                    {
                                    columns:[
                                        
                                {
                                    text:`Prepared by:`,
                                    margin:[0,10,0,0], 
                                    fontSize:10
                                },
                                {
                                    text:`For Immediate Information\n Purposes`,
                                    margin:[-30,30,0,10], 
                                    alignment:'center',
                                    bold:true,
                                    fontSize:14,
                                    italics:true,
                                    color:'blue'
                                }]
                                },
                                {
                                    text:`${item.InvestigatorCode != null || item.InvestigatorCode != undefined ? item.InvestigatorCode : ""}`,
                                    bold: true,
                                    italics: true,
                                    fontSize:9,
                                    margin:[35,0,0,0]
                                },
                                {
                                    text:`Safety Staff/Safety Coordinator`,
                                    decoration: 'overline',
                                    margin:[10,0,0,0], 
                                    fontSize:10
                                },
                                
                                {
                                canvas: [
                                {
                                    type: 'rect',
                                    x: 303,
                                    y: -74,
                                    w: 198,
                                    h: 70,
                                    r: 8,
                                    lineWidth: 2,
                                    lineColor: 'blue',
                                },]
                                }
                            ],
                            
                            
                            
                            footer: function (currentPage, pageCount) {
                            return {
                                table: {
                                    body: [
                                        [
                                            {
                                                text: 'Level D = 0 lost day : Level C = 1-4 lost days : Level B = 5-14 lost days : Level A = 15-30 lost days : Level S =  more than 30 lost days\n', 
                                                margin:[20,0,0,50],
                                                fontSize: 8,
                                                italics: 'true'
                                            },
                                            
                                            {
                                                text: 'Page ' + pageCount,
                                                fontSize: 10,
                                                alignment:'center',
                                                margin:[70,0,0,0]
                                            }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            };
                        },
                            
                                styles: {
                                header: {
                                fontSize: 18,
                                bold: true
                            },
                                bigger: {
                                fontSize: 15,
                                italics: true
                            },

                        }   

                }
                    pdfMake.createPdf(FlashReport).open()
        },
    },


    computed:{
        // Condition in filtering Table Data
        TableFilter(){
            let data = this.tableItems
            
            if(this.filtersir !== undefined && this.filtersir !== "" && this.filtersir !== null){
                data = data.filter((rec) => {
                    return rec.SirNo.includes(this.filtersir.toUpperCase())
                })
            }
            if(this.filterdepartment !== undefined && this.filterdepartment !== "" && this.filterdepartment !== null){
                data = data.filter((rec) => {
                    return rec.Department === this.filterdepartment
                })
            }
            if(this.filterreport !== undefined && this.filterreport !== "" && this.filterreport !== null){
                data = data.filter((rec) => {
                    return rec.ReportID === this.filterreport
                })
            }
            if(this.filterdegree !== undefined && this.filterdegree !== "" && this.filterdegree !== null){
                data = data.filter((rec) => {
                    return rec.DegreeofAccidentID === this.filterdegree
                })
            }
            if(this.date !== undefined && this.date !== "" && this.date !== null){
                data = data.filter((rec) => {
                    return rec.DateHappened.includes(this.date)
                })
            }
            return data
            },
            TableFilter2(){
            let data = this.tableItems2
            if(this.filtersir !== undefined && this.filtersir !== "" && this.filtersir !== null){
                data = data.filter((rec) => {
                    return rec.SirNo.includes(this.filtersir.toUpperCase())
                })
            }
            if(this.filterdepartment !== undefined && this.filterdepartment !== "" && this.filterdepartment !== null){
                data = data.filter((rec) => {
                    return rec.Department === this.filterdepartment
                })
            }
            if(this.filterreport !== undefined && this.filterreport !== "" && this.filterreport !== null){
                data = data.filter((rec) => {
                    return rec.ReportID === this.filterreport
                })
            }
            if(this.filterdegree !== undefined && this.filterdegree !== "" && this.filterdegree !== null){
                data = data.filter((rec) => {
                    return rec.DegreeofAccidentID === this.filterdegree
                })
            }
            if(this.date !== undefined && this.date !== "" && this.date !== null){
                data = data.filter((rec) => {
                    return rec.DateHappened.includes(this.date)
                })
            }
            return data
            },
    },
    mounted(){
        this.onload()
    }
}
</script>

<style>
    .v-data-table>.v-data-table__wrapper>table>tbody>tr>td{
    font-size:12px;
    }

    .MyCard1{
        max-height: 497px;
        min-height: 497px;
        overflow-y: auto;
        overflow-x: auto;
    }
    
</style>
