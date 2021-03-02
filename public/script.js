const Mask = {
    apply(input,func){
        setTimeout(function(){
            input.value = Mask[func](input.value)
        },1)

    },
    formatBRL(value){
        value = value.replace(/\D/g,"")

        return new Intl.NumberFormat('pt-BR',{
            style:'currency',
            currency: 'BRL'
        }).format(value/100)
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event){
        const{files:fileslist} = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileslist).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllfiles()
    },
    hasLimit(event){
        const {uploadLimit, input, preview} = PhotosUpload
        const{ files:fileslist } = input 
        
        if(fileslist.length > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }
        const photosDiv = []
        preview.childNodes.forEach(item =>{
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileslist.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert("Você atingiu o limite máximo de fotos")
            event. preventDefault()
            return true
        }
        return false
    },
    getAllfiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData ||  new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image){
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode // <i> class="photo"
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllfiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e){
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        LightBox.image.src = target.src
    }    
        
}

const LightBox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open(){
        LightBox.target.style.opacity = 1
        LightBox.target.style.top = 0
        LightBox.target.style.bottom = 0
        LightBox.closeButton.style.top= 0
    },
    close(){
        LightBox.target.style.opacity = 0
        LightBox.target.style.top = "-100%"
        LightBox.target.style.bottom = "initial"
        LightBox.closeButton.style.top="-80px"
    }
}







/*METODO ALTERNATIVO DE REPLACE NO INPUT
/*const input = document.querySelector('input[name="price"]')

input.addEventListener("keydown",function(e){
    setTimeout(function(){
        let { value } = e.target

        value = value.replace(/\D/g,"")

        value = new Intl.NumberFormat('pt-BR',{
            style:'currency',
            currency: 'BRL'
        }).format(value/100)

        e.target.value = value
    }, 1)
})*/ 

