<template>
    <span>
        <input :disabled="loading" v-if="isFile" :required="required" type="file" ref="imageFile" @change="save" />
        <input :disabled="loading" v-else v-model="url" :required="required" type="text" placeholder="imageurl.png" @change="upload" />
        <p  v-if="loading" class="status">Uploading...</p>
         <p  v-else class="toggletype" @click="isFile=!isFile"> Or {{(isFile) ? "use an image URL" : "upload an image"}} </p>
    </span>
</template>

<script lang="ts">
import Vue from 'vue'
import connection from "~/services/connection";

export default Vue.extend({
    mounted(){ this.refreshCreds() },
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
</style>