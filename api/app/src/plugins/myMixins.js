import {mapState, mapMutations} from 'vuex'
import moment from 'moment'
const myPlugin = {
    install(Vue){
        Vue.mixin({
            data:()=>({
                api: process.env.VUE_APP_LOCAL_URL, // access .env file "VUE_APP_URL" w/c is url to server side script
                // CompanyPath:'',
            
            }),
            created() {
                this.axios.defaults.headers.common['master-api'] = process.env.VUE_APP_URL_KEY
                // this.ConvertCompanyPath()
            },
            computed:{
                ...mapState([
                    'SIdatabank_userInfo',
                    'isLogin', 
                    'searchData',       
                    'emplcode',
                    'navDrawerVal',
                    'isConnect'
                ])
            },
            methods:{
                getBase64ImageFromURL(url) {  // PDF MAKE PICTURE 
                    return new Promise((resolve) => {
                    var img = new Image();
                    img.setAttribute("crossOrigin", "anonymous");
                    img.onload = () => {
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        var dataURL = canvas.toDataURL("image/png");
                        resolve(dataURL);
                    };
                        img.src = url;
                    });
                },  
                // ConvertCompanyPath() {
                //     if(this.SIdatabank_userInfo.CompanyCode === '00'){
                //     this.CompanyPath = 'PV'
                //     }
                //     else if(this.SIdatabank_userInfo.CompanyCode === '10'){
                //     this.CompanyPath = 'SCD'
                //     }
                //     else if(this.SIdatabank_userInfo.CompanyCode === '20'){
                //     this.CompanyPath = 'HTI'
                //     }
                //     else if(this.SIdatabank_userInfo.CompanyCode === '30'){
                //     this.CompanyPath = 'HRD'
                //     }
                //     else if(this.SIdatabank_userInfo.CompanyCode === '40'){
                //     this.CompanyPath = 'WKN'
                //     }
                // },

                formatYearMonthDay( date ){
                    return moment(date).format("YYYY-MM-DD")
                },
                formatYear( date ){
                    return moment(date).format("YYYY")
                },
                formatDateSIR( date ){
                    return moment(date).format("YYYYMMDD")
                },
                ...mapMutations([
                    'CHANGE_USER_INFO', 
                    'CHANGE_USER_LOGGING', 
                    'CHANGE_SEARCHING',
                    'CHANGE_EMPLCODE',
                    'CHANGE_NAVDRAWER',      
                    'CHANGE_CONNECTION'
                ])
            }         
        })
    }
}
export default myPlugin
