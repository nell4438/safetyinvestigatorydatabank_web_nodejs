<template>
    <v-main>
        <v-overlay :value="isloading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-container fluid>
            <v-card class="mt-3" v-if="isloading== false" :class="[isloading == false ? `imagehover` : '']">
                <v-row>
                    <v-col>
                        <v-card-subtitle class='ml-5  pb-7 mr-4 pt-5 ' style="font-size:20px">Extent of Injury</v-card-subtitle>
                    </v-col>
                    <v-col cols='4'  class="mr-5" >
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details>
                        </v-text-field>
                    </v-col>
                    <v-btn @click="newRecord()" dark style="background-color:#03a89a" class="mr-10 mt-7 white--text" float='right'>
                        <v-icon>mdi-plus</v-icon>Add
                    </v-btn>
                </v-row>
                <v-divider></v-divider>     
                
                <v-data-table 
                    :headers="headers" 
                    :items="ExtentofInjuryItems" 
                    :search="search" 
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    dense
                    hide-default-footer>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip top>        
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon @click="modifyData(item)" v-bind="attrs"  v-on="on" color='orange'>mdi-pencil-outline</v-icon>
                            </template>
                            <span>Edit Record</span> 
                        </v-tooltip>
                        <v-tooltip top>        
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-show="!item.DeletedDate" v-bind="attrs"  v-on="on" color="red"  @click="deleteData(item)">mdi-delete-outline</v-icon> 
                            </template>
                        <span>Delete Record</span> 
                    </v-tooltip>
                    <v-tooltip top>        
                            <template  v-slot:activator="{ on, attrs }">
                                <v-icon  v-show="item.DeletedDate" color='#03a89a' @click="ActivateData(item)" v-bind="attrs"  v-on="on">mdi-recycle</v-icon>
                            </template>
                        <span>Activate Record</span> 
                    </v-tooltip>
                    </template>
                </v-data-table>
                <v-pagination  v-model="page" :length="pageCount" :total-visible="10" color='#03a89a'></v-pagination>
                <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                        <v-toolbar color="teal" dark flat >
                            <h4 class="ml-4">{{editMode == true ? 'Edit Record' : 'New Record'}}</h4>
                        </v-toolbar>
                        <v-container>
                            <v-form ref="form" v-model="valid" lazy-validation class="mt-4">
                                <v-row align="center" justify="center" dense>  
                                    <v-col v-if="editMode == true" cols="11">
                                        <v-text-field  
                                            v-model="toModify.ExtentInjuryID"                    
                                            label="ID"
                                            :disabled=" editMode == true ? true : false"
                                            dense
                                            outlined       
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-text-field     
                                            v-model="toModify.ExtentOfInjuries"                  
                                            label="Classification Name"  
                                            dense
                                            outlined         
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row><v-col> 
                                    <v-btn v-if='editMode == true' @click="saveRecords()" dark  style="background-color:#03a89a;margin-left:20px;margin-bottom:20px" width='435'>Save</v-btn>
                                    <v-btn v-else @click="addRecords()" dark  style="background-color:#03a89a;margin-left:20px;margin-bottom:20px" width='435'>Add</v-btn>
                                </v-col></v-row>
                            </v-form>   
                        </v-container>   
                    </v-card>  
                </v-dialog>
            </v-card>
        </v-container>        
    </v-main>   
</template>


<script>

import moment from 'moment'
export default{
    data() {
        return {
            valid: true,
            pageCount: 0,
            page: 1,
            dialog: false,
            isloading: false,
            toModify: {},
            editMode: false,
            search:"",
            ExtentofInjuryItems: [],
            saveOptions: {
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    denyButtonText: `Don't Save`
            },
            headers:[
                { text: "ID", value: "ExtentInjuryID" },
                { text: "Extent Injury Name", value: "ExtentOfInjuries" },
                { text: "Deleted Date", value: "DeletedDate" },
                { text: "Actions", value: "actions" },
            ],
        };
    },
    mounted(){
    this.getExtentofInjury();
    },

    computed:{
        filteredData(){
            if(!this.search.toLowerCase()){
                return this.ExtentofInjuryItems
            }else{
                return this.ExtentofInjuryItems.filter(rec=>{
                return rec.ExtentOfInjury.includes(this.search)
                })
            }
        }, 
        GV_UserID: {
            get() {
            return this.$store.state.SIdatabank_userInfo.EmployeeID
            }
        } 
    },

    methods: { 

        getExtentofInjury(){
            this.isloading = true
            this.axios.get(`${this.api}/getextentofinjuryNULL`).then(res=>{
                this.ExtentofInjuryItems=res.data
                this.isloading = false
            })
        },
        newRecord() {
                this.dialog = true
                this.editMode = false
                this.toModify = {}
            },
        modifyData(item) {
                this.dialog = true
                this.editMode = true
                this.toModify = this.editMode == false ? {} :Object.assign({},item);
            },
        saveRecords() {                       
                this.swal.fire(this.saveOptions).then(result => {
                    if(result.isConfirmed){
                        this.axios.post(`${this.api}/updateextentofinjury`,this.toModify).then(() => {
                        this.swal.fire('Hooray!','Changes has been saved', 'success')
                        this.dialog=false
                        this.editMode = false
                        this.getExtentofInjury() 
                        })
                    }else if(result.isDenied) {
                        this.swal.fire('Oh no!', 'Changes are not saved', 'info')
                    }
                })
            },
        addRecords(){
            this.toModify.ExtentInjuryID = this.ExtentofInjuryItems.length + 1,
            this.toModify.CreatedDate = moment().format("YYYY/MM/DD"),
            this.toModify.UpdatedDate = moment().format("YYYY/MM/DD"),
            this.toModify.UpdatedBy = this.SIdatabank_userInfo.EmployeeID
            this.swal.fire(this.saveOptions).then(result => {
            if(result.isConfirmed){
                this.axios.post(`${this.api}/addextentofinjury`,this.toModify).then(() => {
                this.swal.fire('Hooray!','Changes has been saved', 'success')
                this.dialog=false
                this.editMode = false
                this.getExtentofInjury() 
                })
                }else if(result.isDenied) {
                    this.swal.fire('Oh no!', 'Changes are not saved', 'info')
                }
            })
        },
        deleteData(item) {
                this.swal.fire(this.saveOptions).then(result => {
                    if(result.isConfirmed){
                        this.axios.post(`${this.api}/deleteextentofinjury`,item).then(() => {
                        this.swal.fire('Hooray!','Changes has been saved', 'success')
                        this.dialog=false
                        this.editMode = false
                        this.getExtentofInjury() 
                        })
                    }else if(result.isDenied) {
                    this.swal.fire('Oh no!', 'Changes are not saved', 'info')
                }
            })
        },
        ActivateData(item){
            this.swal.fire(this.saveOptions).then(result => {
                if(result.isConfirmed){
                        this.axios.post(`${this.api}/activeextentofinjury`,item).then(() => {
                        this.swal.fire('Hooray!','Changes has been saved', 'success')
                        this.dialog=false
                        this.editMode = false
                        this.getExtentofInjury() 
                        })
                    }else if(result.isDenied) {
                    this.swal.fire('Oh no!', 'Changes are not saved', 'info')
                }
            })
        },                                      
    },

        
}
</script>
<style >
.imagehover {
position: relative;
animation-name: imagehover;
animation-duration: 1s;  
animation-fill-mode: forwards;
}

@keyframes imagehover {
from {bottom: 30px;}
to {bottom: 0px;}
}
</style>