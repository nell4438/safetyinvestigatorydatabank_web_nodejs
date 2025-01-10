<template>
    <v-main>
        <v-overlay :value="isloading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-container fluid>
            <v-card class="mt-3" v-if="isloading== false"  :class="[isloading == false ? `imagehover` : '']">
                <v-row>
                    <v-col>
                        <v-card-subtitle class='ml-5  pb-7 mr-4 pt-5 ' style="font-size:20px">User Maintenance</v-card-subtitle>
                    </v-col>
                    <v-col  cols='2'>
                        <v-autocomplete
                        class=" mt-4"
                            v-model="filterUserLevel"
                            :items='UserLevelItems'
                            dense 
                            outlined
                            clearable
                            label="User Level">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols='3'  class="mr-3" >
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            outlined
                            dense
                            class="mt-4"
                            hide-details>
                        </v-text-field>
                    </v-col>
                    <v-btn @click="addData()" dark style="background-color:#03a89a" class="mr-10 mt-7 white--text" float='right'>
                        <v-icon>mdi-plus</v-icon>Add
                    </v-btn>
                </v-row>
                
                <v-data-table 
                    class="pl-5 pr-5"
                    :headers="headers" 
                    :items="filterUserLevels" 
                    :search="search" 
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    dense
                    hide-default-footer>

                    <template v-slot:[`item.UserLevels`]="{ item }">
                    <v-chip
                        :color="getColor(item.UserLevels)"
                        dark
                        small
                    >{{ item.UserLevels }}
                    </v-chip>
                    </template>
                    <template v-slot:[`item.DeleteStatus`]="{ item }">
                    <v-chip
                        :color="getColorDeleted(item.DeleteStatus)"
                        dark
                        small
                    >{{ item.DeleteStatus }}
                    </v-chip>
                    </template>
                    <template v-slot:[`item.EmployeeImage`]="{item}" >
                        <div class="img-hover-zoom">
                                <img  :src="`http://hrd-adminweb/photos/${item.EmployeeID}.jpg`"  @error="viewAltImage" 
                                :class="[item.EmployeeID !== SIdatabank_userInfo.EmployeeID  ? 'border-color-gray' :'border-color-green'   ]" width="35px" height="35px" >
                        </div>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip top>        
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon @click="modifyData(item)" v-bind="attrs"  v-on="on" color='orange'>mdi-pencil-outline</v-icon>
                            </template>
                            <span>Edit User</span> 
                        </v-tooltip>
                        <v-tooltip top>        
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon v-show="!item.DeletedDate" v-bind="attrs"  v-on="on" color="red"  @click="deleteData(item)">mdi-delete-outline</v-icon> 
                            </template>
                        <span>Remove User</span> 
                    </v-tooltip>
                    <v-tooltip top>        
                            <template  v-slot:activator="{ on, attrs }">
                                <v-icon  v-show="item.DeletedDate" color='#03a89a' @click="ActivateData(item)" v-bind="attrs"  v-on="on">mdi-recycle</v-icon>
                            </template>
                        <span>Activate User</span> 
                    </v-tooltip>
                     <v-tooltip top>        
                            <template  v-slot:activator="{ on, attrs }">
                                <v-icon  v-show="item.DeletedDate" color='red' @click="PermanentDelete(item)" v-bind="attrs"  v-on="on">mdi-database-remove</v-icon>
                            </template>
                        <span>Delete Permanently</span> 
                    </v-tooltip>
                    </template>
                </v-data-table>
                <v-pagination  v-model="page" :length="pageCount" :total-visible="10" color='#03a89a'></v-pagination>

                
                <v-dialog v-model="editDialog" max-width="450px" persistent>
                    <v-card>
                        <v-toolbar dense color="teal" dark flat >
                            <h4 class="ml-4">Edit User</h4>
                            <v-spacer></v-spacer>
                            <v-icon @click="close()">mdi-close-thick</v-icon>
                        </v-toolbar>
                        <v-container>
                            <v-form  lazy-validation class="mt-4">
                                <v-row  v-if="toModify.EmployeeName !== '' " align="center" justify="center" dense>
                                    <v-col cols="11">
                                    <img style="margin-left:110px;margin-right:110px;margin-bottom:20px;border-radius:50%;border: 3px solid #eeeeee;" 
                                        :src="`http://hrd-adminweb/photos/${toModify.EmployeeID}.jpg`" 
                                        @error="viewAltImage"  
                                        width="170px" 
                                        height="170px" >
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense>  
                                    <v-col  cols="11">
                                        <v-text-field  
                                            v-model="toModify.EmployeeID"                   
                                            label="Employee Code"
                                            disabled
                                            dense
                                            outlined       
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-text-field     
                                            v-model="toModify.EmployeeName"                  
                                            label="Employee Name"  
                                            disabled
                                            dense
                                            outlined         
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row align="center" justify="center" dense>  
                                    <v-col  cols="11">
                                        <v-text-field  
                                            v-model="toModify.CompanyName"                   
                                            label="Company Name"
                                            disabled
                                            dense
                                            outlined       
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense>  
                                    <v-col  cols="11">
                                        <v-text-field  
                                            v-model="toModify.DepartmentName"                   
                                            label="Department Name"
                                            disabled
                                            dense
                                            outlined       
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-select       
                                            v-model="toModify.UserLevel"                
                                            label="Access Level"  
                                            :items='UserLevelItems '
                                            dense
                                            outlined         
                                        ></v-select>
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-text-field     
                                            v-model="toModify.Password"                  
                                            label="Password"  
                                            dense
                                            hint="Recommended Password (Employee's ID)"
                                            outlined         
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row><v-col> 
                                    <v-btn  @click="saveRecords()" dark  style="background-color:#03a89a;margin-left:20px;margin-bottom:10px" width='385'>Save</v-btn>
                                </v-col></v-row>
                            </v-form>   
                        </v-container>   
                    </v-card>  
                </v-dialog>

                <v-dialog v-model="addDialog" max-width="450px" persistent>
                    <v-card>
                        <v-toolbar dense color="teal" dark flat >
                            <h4 class="ml-4">New User</h4>
                            <v-spacer></v-spacer>
                            <v-icon @click="close()">mdi-close-thick</v-icon>
                        </v-toolbar>
                        <v-container>
                            <v-form ref="form" v-model="valid" lazy-validation class="mt-4">
                                <v-row align="center" justify="center" dense>
                                    <v-col  cols="11">
                                    <img v-if="addEmployeeName !== ''" style="margin-left:110px;margin-right:110px;margin-bottom:20px;border-radius:50%;border: 3px solid #eeeeee;" 
                                        :src="imageaddEmployee" 
                                        @error="viewAltImage"  
                                        width="170px" 
                                        height="170px" >
                                    <img v-if="addEmployeeName == ''" style="margin-left:110px;margin-right:110px;margin-bottom:20px;border-radius:50%;border: 3px solid #eeeeee;" 
                                        :src="`http://hrdapps48:3001/ftp/employee_pictures/unkown.png` " 
                                        @error="viewAltImage"  
                                        width="170px" 
                                        height="170px" >
                                    </v-col>
                                </v-row>
                                <v-row align="center" justify="center" dense>  
                                    <v-col  cols="11">
                                        <v-text-field  
                                            v-model="addEmployeeID"
                                            @change="getEmployeeInfo()"  
                                            :rules="nameRules"                  
                                            label="Employee Code"
                                            :persistent-hint="addEmployeeID !== ''  ? true : false"
                                            :hint="addEmployeeID !== '' ? `Enter to Search` : ''"
                                            dense
                                            outlined       
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row   align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-text-field     
                                            v-model="addEmployeeName"                  
                                            label="Employee Name"  
                                            readonly
                                            dense
                                            outlined         
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row   align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-select       
                                            v-model="addUserLevel"                
                                            label="User Level"  
                                            :items='UserLevelItems'
                                            dense
                                            outlined         
                                        ></v-select>
                                    </v-col>
                                </v-row>
                                <v-row  align="center" justify="center" dense> 
                                    <v-col cols="11">
                                        <v-text-field     
                                            v-model="addPassword"                  
                                            label="Password"  
                                            dense
                                            :rules="nameRules"
                                            :persistent-hint="addEmployeeName !== '' ? true : false"
                                            :hint="addEmployeeName !== '' ? `Recommended Password (Employee's ID)` : ''"
                                            outlined         
                                        ></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row><v-col> 
                                    <v-btn    @click="addRecords()" dark  style="background-color:#03a89a;margin-left:20px;margin-bottom:10px" width='385'>Add</v-btn>
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
import Swal from 'sweetalert2'
import store from '@/store'
// import moment from 'moment'
export default{
    data() {
        return {
            valid: true,
            pageCount: 0,
            page: 1,
            editDialog: false,
            addDialog: false,
            toModify: {},
            toSave:{},
            isloading:false,
            search:"",
            filterUserLevel:'',
            addEmployeeID:'',
            addCompanyCode:'',
            addDepartmentCode:'',
            addEmployeeName:'',
            addUserLevel:0,
            addPassword:'',
            imageaddEmployee:'',
            UserLevelItems:[{ text: 'User', value: 0}, { text: 'Admin', value: 1 }],
            SafetyUsers: [],
            APIData:{},
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
                { text: "Users", value: "EmployeeImage" },
                { text: "Employee Name", value: "EmployeeName" },
                { text: "Employee Code", value: "EmployeeID" },
                { text: "User Level", value: "UserLevels" },
                { text: "Account Status", value: "DeleteStatus" },
                { text: "Deleted Date", value: "DeletedDate" },
                { text: "Actions", value: "actions" },
            ],
            nameRules: [
                v => !!v || 'This field is required'
            ],
            EmployeeInfoURL:'http://hrd-adminweb:8700/api/basicinfo'
        };
    },
    created(){
    this.getSafetyUsers();
    store.state.SIdatabank_userInfo
    },

    computed:{
        filteredData(){
            if(!this.search.toLowerCase()){
                return this.SafetyUsers
            }else{
                return this.SafetyUsers.filter(rec=>{
                return rec.SafetyUsers.includes(this.search)
                })
            }
        }, 
        filterUserLevels(){
            let data = this.SafetyUsers
            if(this.filterUserLevel !== undefined && this.filterUserLevel !== "" && this.filterUserLevel !== null){
                data = data.filter((rec) => {
                    return rec.UserLevel === this.filterUserLevel
                })
            }
            return data
        }
    },

    methods: { 

        getEmployeeInfo(){
            if(this.addEmployeeID !== undefined && this.addEmployeeID !== null && this.addEmployeeID.trim() !== ""){
                let url = `${this.EmployeeInfoURL}/${this.addEmployeeID}`
                this.axios(url).then(res => {
                    this.APIData = res.data[0]
                    if( this.APIData !== undefined && this.APIData !== null && this.APIData !== {} &&  this.APIData !== []  &&  this.addEmployeeID !== '' ){
                        this.imageaddEmployee = "http://hrd-adminweb/photos/" + this.addEmployeeID + ".jpg"
                        this.addPassword = this.APIData.EmployeeCode
                        this.addEmployeeName = this.APIData.EmployeeName
                        this.addCompanyCode = this.APIData.CompanyCode
                        this.addDepartmentCode = this.APIData.DepartmentCode
                    }
                    else{ 
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
                        this.imageaddEmployee = ""
                        this.addEmployeeName = ""
                        this.addEmployeeID = ""
                        this.addPassword = ""
                    }
                })
            } else {
                this.imageaddEmployee = ""
                this.addEmployeeName = ""
                this.addEmployeeID = ""
                this.addPassword = ""
            }
        },
        getSafetyUsers(){
            this.isloading = true
            this.axios.get(`${this.api}/getSafetyUsers/${this.SIdatabank_userInfo.CompanyCode}`).then(res=>{
                
                this.SafetyUsers = res.data
            this.isloading = false
            })
        },
        newRecord() {
                this.dialog = true
                this.editMode = false
                this.toModify = {}
            },
        modifyData(item) {
            this.axios.get(`${this.EmployeeInfoURL}/${item.EmployeeID}`).then(res=>{
                res.data.map(rec=>{
                        item.CompanyName = rec.CompanyName
                        item.DepartmentName = rec.DepartmentName
                        this.toModify = Object.assign({}, item);
                })
                
            })
            this.editDialog = true
            },
        addData() {
            this.imageaddEmployee = ""
            this.addEmployeeName = ""
            this.addEmployeeID = ""
            this.addPassword = ""
            this.addDialog = true
            },
        saveRecords() {                  
            this.toModify.UpdatedBy = this.SIdatabank_userInfo.EmployeeID  
                Swal.fire({
                title: `Update changes?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.post(`${this.api}/updateUser`,this.toModify).then(() => {
                    Swal.fire(
                    'Updated!',
                    `Account has been updated `,
                    'success'
                    )
                    this.editDialog = false
                    this.getSafetyUsers()
                    })
                }
            })   
            },
        addRecords(){
            if((this.addEmployeeID.trim() === '' || this.addEmployeeID === undefined || this.addEmployeeID === null) ||
                (this.addPassword.trim() === '' || this.addPassword === undefined || this.addPassword === null)){
                this.$refs.form.validate();
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
            } else {
                let isExist = false
                this.axios.get(`${this.api}/getSafetyUsers/${this.SIdatabank_userInfo.CompanyCode}`).then(res => {
                    res.data.forEach(rec=>{
                        if(rec.EmployeeID === this.addEmployeeID){
                            isExist = true
                        }
                    })

                    if (isExist === true){
                        const Toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        timer: 4000,
                        showConfirmButton: false
                        })
                        Toast.fire({
                        icon: 'warning',
                        title: `Employee ID is already registered!`
                        })  
                    }
                    else if (isExist === false){
                        this.toSave = {
                            "EmployeeID" : this.addEmployeeID,
                            "CompanyCode" : this.addCompanyCode,
                            "DepartmentCode" : this.addDepartmentCode,
                            "UserLevel" : this.addUserLevel,
                            "EmployeeName" : this.addEmployeeName,
                            "Password" : this.addPassword,
                            "UpdatedBy": this.SIdatabank_userInfo.EmployeeID
                        }

                    

                        Swal.fire({
                            title: `Add ${this.addEmployeeName}?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.axios.post(`${this.api}/addUser`,this.toSave).then(() => {
                                    Swal.fire(
                                    'Added!',
                                    `Account has been added`,
                                    'success'
                                    )
                                    this.addDialog=false
                                    this.getSafetyUsers() 
                                })
                            }
                        })
                    }
                })      
            }
        },
        deleteData(item) {
            Swal.fire({
            title: `Remove ${item.EmployeeName}?`,
            text:'This account will be temporarily removed',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.isConfirmed) {
                this.axios.post(`${this.api}/deleteUser`,item).then(() => {
                Swal.fire(
                'Removed!',
                `Account has been removed`,
                'success'
                )
                this.getSafetyUsers()
                })
            }
        })
        },
        PermanentDelete(item){
            Swal.fire({
            title: `Delete ${item.EmployeeName}?`,
            text:'This account will be permently deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.isConfirmed) {
                this.axios.post(`${this.api}/permanentDelete`,item).then(() => {
                Swal.fire(
                'Deleted!',
                `Account has been deleted`,
                'success'
                )
                this.getSafetyUsers()
                })
            }
        })
        },
        ActivateData(item){
            Swal.fire({
            title: `Activate ${item.EmployeeName}?`,
            text:'This account will be reactivated',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
            }).then((result) => {
            if (result.isConfirmed) {
                this.axios.post(`${this.api}/activateUser`,item).then(() => {
                Swal.fire(
                'Activated!',
                `Account has been reactivated`,
                'success'
                )
                this.getSafetyUsers()
                })
            }
        })
        },     
        viewAltImage(event){
            event.target.src = "http://hrdapps48:3001/ftp/employee_pictures/unkown.png"
        },
        close(){
            this.addEmployeeID = ''
            this.addEmployeeName = ''
            this.addUserLevel = 0
            this.addPassword = ''
            this.editDialog = false
            this.addDialog = false
        },
        getColor(UserLevels){
            if (UserLevels ==  'Admin') return '#03a89a'
        else  return 'orange'
        },
        getColorDeleted(DeletedStatus){
            if (DeletedStatus ==  'Active') return 'blue'
        else return 'red'
        },
                      
    },
    

        
}
</script>
<style scoped>


/* [2] Transition property for smooth transformation of images */
.img-hover-zoom img {
  transition: transform .5s ease;
}

/* [3] Finally, transforming the image when container gets hovered */
.img-hover-zoom:hover img {
  transform: scale(1.5);
}
.border-color-green{
border-radius:50%; border: 3px solid #03a89a
}
.border-color-gray{
border-radius:50%; border: 3px solid #eeeeee
}
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



