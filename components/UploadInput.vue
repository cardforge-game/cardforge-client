<template>
    <span>
        <p v-if="loading" class="status">Uploading...</p>
        <p v-else class="toggletype" @click="isFile=!isFile"> Or {{(isFile) ? "use an image URL" : "upload an image"}}</p>
        <label v-if="isFile" class="upload">
            <p :class="{'button':true,'disabled':loading}">Upload Image</p>
            <input :disabled="loading" :required="required" type="file" ref="imageFile" @change="save" />
        </label>
        <input :disabled="loading" v-else v-model="url" :required="required" type="text" placeholder="imageurl.png"
            @change="emmitChange" />
    </span>
</template>

<script lang="ts">
import Vue from 'vue'
import connection from "~/services/connection";

const toBase64 = (file:File):Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
})

export default Vue.extend({
    mounted(){ 
        this.refreshCreds()
        connection.$on("restore",(imgURL: string)=>{
            try{
             let arr = imgURL.split(',');
             const match = arr[0].match(/:(.*?);/)
             if(!match) return;
             const mime = match[1]
             const bstr = atob(arr[1])
             let n = bstr.length
             const u8arr = new Uint8Array(n);
             while (n--) {
                 u8arr[n] = bstr.charCodeAt(n);
             }
             const file = new Blob([u8arr], {
                 type: mime
             }) as File
            this.file = file;
            }catch(e){
                console.log("Failed to restore")
                console.log(e)
            }
        })
        connection.$on("submit",()=>{
            this.url = "";
            this.file = null;
            this.isFile = true;
        })
        
        connection.$on("upload",()=>{
            this.upload()
        })
    },
    beforeDestroy(){ 
        connection.$off("restore")
        connection.$off("submit")
        connection.$off("upload")
    },
    props:{
        onError: { type: Function, required: true},
        onSuccess: { type: Function, required: true},
        required: { type: Boolean, required: false}
    },
    data(){
        return { 
            isFile: true,
            loading:false,
            publicKey:"public_wWwwbVoz/HpvJnKkj5Trk2RUWBM=",
            urlEndpoint: "https://ik.imagekit.io/cardforge",
            url:"",
            file: null as File|null
        }
    },
    methods:{
        refreshCreds(){
            //Get credentials from the server
            connection.room?.send("requestUploadCredentials")
        },
        save(){
            const fileElement = (this.$refs.imageFile as HTMLInputElement);
            if(!fileElement || !fileElement.files) return;

            const file = fileElement.files[0]
            this.file = file

            this.emmitChange()
            
        },
        async emmitChange(){
            connection.$emit("imageChanged",(this.file && this.isFile) ? await toBase64(this.file) : this.url)
        },
        async upload(){
            if((!this.file && !this.urlEndpoint) || !connection.room) return;
            this.loading = true

            //build payload for image upload 
            const body = new FormData();

            body.append("publicKey",this.publicKey)
            body.append("file", (this.file && this.isFile) ? this.file : this.url)
            body.append("fileName", connection.room.id)
            for (const k in connection.unsynced.uploadCredentials){
                body.append(k,connection.unsynced.uploadCredentials[k])
            }
            

            fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body
            }).then((res) => {
                if(res.ok) return res.json()
                return res.json().then(r=>{throw {
                    ...r,
                    e:new Error()
                }})
            }).then((res: UploadResponse) => {
                if (res.fileType !== "image") {
                    throw {
                        ...res,
                        message: "We are not able to download file from that url. Kindly check if it is a valid URL or not.",
                        e: new Error()
                    }
                }
                this.onSuccess(res)
                this.loading = false
            }).catch((e: UploadResponseError) => {
                this.onError(e)
                this.loading = false
            })
            this.url = ""
            this.refreshCreds()
            
        }
    }
})
</script>

<style scoped>
.toggletype{
    text-align: center;
    color: var(--primary);
    cursor: pointer;
    text-decoration: underline;
}
.status{
    text-align: center;
    color: var(--success);
    font-weight: bold;
}

.upload{
    cursor: pointer;
}

.upload input[type="file"] {
    display: none;
}
</style>