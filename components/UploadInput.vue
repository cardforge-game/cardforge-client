<template>
    <span>
        <p v-if="loading" class="status">Uploading...</p>
        <p v-else class="toggletype" @click="isFile=!isFile"> Or {{(isFile) ? "use an image URL" : "upload an image"}}</p>
        <label v-if="isFile" class="upload">
            <p :class="{'button':true,'disabled':loading}">Upload Image</p>
            <input :disabled="loading" :required="required" type="file" ref="imageFile" @change="save" />
        </label>
        <input :disabled="loading" v-else v-model="url" :required="required" type="text" placeholder="imageurl.png"
            @change="upload" />
    </span>
</template>

<script lang="ts">
import Vue from 'vue'
import connection from "~/services/connection";

export default Vue.extend({
    mounted(){ 
        this.refreshCreds() 
        connection.$on("restore",(imgURL: string)=>{
            this.url = imgURL;
            this.upload();
        })
        connection.$on("submit",()=>{
            this.url = "";
            this.file = null;
            this.isFile = true;
        })
    },
    beforeDestroy(){ 
        connection.$off("restore")
        connection.$off("submit")
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

            this.upload()
            
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