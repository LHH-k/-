//图片上传
Vue.component('my-upload', {
    props:['picUp','ind','txt'],
    template: `
        <!--移动端压缩上传-->
        <div class="pic-box"> 
            <input id="imgUpload" type="file" @change="addPic" accept="image/*" name="photo"/>
            <img v-if="img" :src="img"/>
            <div v-else>
                <van-icon name="add-o"></van-icon>
                <span>{{txt}}</span>
            </div>
        </div>

        <!--pc端element插件上传-->
        <!--
        <el-upload
            capture="camera"
            accept="image/*"
            class="pic-box"
            :action="picInfo.url"
            :name = "picInfo.name"
            :show-file-list="false"
            :on-success="picUpSuccess"
            :on-error="picUpErr"
            :before-upload="beforePicUpload">
                <img v-if="img" :src="img"/>
                <div v-else>
                    <van-icon name="add-o"></van-icon>
                    <span>{{txt}}</span>
                </div>
        </el-upload>
        -->
        `,
    data(){
        return{
            globalToast:null,
            img:'',
            picInfo : this.picUp,
            ind : this.ind,
            txt : this.txt,
        }
    },
    methods:{
        //上传成功回调
        // picUpSuccess(res,file){
        //     console.log(res,file);
        //     this.globalToast.clear();
        //     this.img = URL.createObjectURL(file.raw);
        //     //子组件间数据返回父组件
        //     this.$emit("childget", this.ind , res.data.store_result);
        // },
        //图片上传前
        // beforePicUpload(file){
        //     console.log(file)
        //     this.globalToast = this.$toast.loading({
        //         duration: 0,       // 持续展示 toast
        //         mask:true,			//背景层
        //         forbidClick: true, // 禁用背景点击
        //         message: '图片上传中...'
        //     });
        //     const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        //     const isLt2M = file.size / 1024 / 1024 < 2;
        //     if (!isJPG) {
        //         this.$toast.fail('上传的图片只能是JPG/PNG格式!');
        //     }
        //     if (!isLt2M) {
        //         this.$toast.fail('上传的图片大小不能超过2MB!');
        //     }
        //     return isJPG && isLt2M;
        // },
        //上传失败的回调
        // picUpErr(err){
        //     this.$message.error(err);
        // },

        /////////////////js原生的上传并压缩图片///////////////////////
        addPic(e){
            this.globalToast = this.$toast.loading({
                duration: 0,       // 持续展示 toast
                mask:true,			//背景层
                forbidClick: true, // 禁用背景点击
                message: '图片上传中...'
            });
            if (typeof FileReader === 'undefined') {
              return alert('你的浏览器不支持上传图片哟！');
            }
            var files = e.target.files || e.dataTransfer.files;
            if(files.length > 0){
                this.imgResize(files[0]);
            }
        },
        //压缩图片
        imgResize(file){
            var fileReader = new FileReader();
            var _that = this;
            fileReader.onload = function () {
                var IMG = new Image();
                IMG.src = this.result;
                IMG.onload = function () {
                    var w = this.naturalWidth, h = this.naturalHeight, resizeW = 0, resizeH = 0;
                    // maxSize 是压缩的设置，设置图片的最大宽度和最大高度，等比缩放，level是报错的质量，数值越小质量越低
                    var maxSize = {
                        width: 700,
                        height: 700,
                        level: 0.6
                    };
                    // if (w > maxSize.width || h > maxSize.height) {
                    var multiple = Math.max(w / maxSize.width, h / maxSize.height);
                    resizeW = w / multiple;
                    resizeH = h / multiple;
                    // } else {
                    //     // 如果图片尺寸小于最大限制，则不压缩直接上传
                    //     _that.callback(file,1)
                    // }
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                    if (window.navigator.userAgent.indexOf('iPhone') > 0) {
                        canvas.width = resizeH;
                        canvas.height = resizeW;
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.drawImage(IMG, 0, -resizeH, resizeW, resizeH);
                    } else {
                        canvas.width = resizeW;
                        canvas.height = resizeH;
                        ctx.drawImage(IMG, 0, 0, resizeW, resizeH);
                    }
                    var base64 = canvas.toDataURL('image/jpeg', maxSize.level);
                    _that.convertBlob(window.atob(base64.split(',')[1]));
                }
            };
            fileReader.readAsDataURL(file);
        },
        // 将base64的数据转换成一个Blob对象
        // 安卓手机不支持Blob构造方法
        convertBlob(base64){
            var buffer = new ArrayBuffer(base64.length);
            var ubuffer = new Uint8Array(buffer);
            for (var i = 0; i < base64.length; i++) {
              ubuffer[i] = base64.charCodeAt(i)
            }
            var blob;
            try {
              blob = new Blob([buffer], {type: 'image/jpg'});
            } catch (e) {
              window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
              if(e.name === 'TypeError' && window.BlobBuilder){
                var blobBuilder = new BlobBuilder();
                blobBuilder.append(buffer);
                blob = blobBuilder.getBlob('image/jpg');
              }
            }
            this.callback(blob)
        },
        // 使用HTML5的FormData对象上传数据
        callback(fileResize){
            var data = new FormData();
            data.append(this.picInfo.name,fileResize);
            var config = {
              headers: {'Content-Types': 'multipart/form-data'}
            };
            //上传图片给后台
            axios.post(this.picInfo.url, data, config).then((res)=>{
                this.globalToast.clear();
                this.img = window.location.origin + res.data.data.store_result;
                //子组件间数据返回父组件
                this.$emit("childget", this.ind , res.data.data.store_result);
            }).catch((err)=>{})
        }
          
    },
})