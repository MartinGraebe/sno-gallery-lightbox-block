const { __ } = wp.i18n; // for internationalization
const { registerBlockType } = wp.blocks; 
const {InspectorControls, MediaUploadCheck, MediaUpload} = wp.blockEditor;
const { Button, Icon } = wp.components;



// register block

registerBlockType('sno/sno-gallery-lightbox-block', {
    title:__('sno-gallery-lightbox-block'),
    icon: 'format-gallery',
    category: 'common',
    keywords: [
        __( 'Gallery Block' ),
        __( 'Lightbox' ),
        __( 'sno-gallery-lightbox-block' ),
    ],

    attributes: {
        galleryImages: {
			type: 'array',
			default: [],

		
        },
        imageIds:{
            type: 'array',
            default: [],
        },
        galleryId: {
            type: 'string',
            default: '',
        },
      
      
        
    },

    edit: (props) => {
        const { setAttributes, attributes } = props;
        const { galleryImages, galleryId, imageIds } = props.attributes;
        function createRandomId(){
            const date = new Date();
            const sec = date.getMilliseconds();
            const id = Math.ceil(Math.random()*100) + sec;
            return id.toString();
        }
        function onGallerySelect(galleryObject) {
            setAttributes({
                galleryImages: galleryObject,
                imageIds: galleryObject.map((item) => {return item.id}), // get selected image ids so that selected images are shown as selected if user changes selection
                galleryId: createRandomId(), 
            })
        }
        const giveOutImages = galleryImages.length > 0 && galleryImages.map( item => 
            <img id={`sno-gallery-block-image-${item.id}`} class="sno-gallery-block-image"  alt={item.title} src={item.sizes.thumbnail.url}/>
        
        
        )


        const ALLOW_MEDIA_TYPES = ['image'];
		function MyGalleryUploader(){
			return(
				<MediaUploadCheck>
					<MediaUpload 
						onSelect = {onGallerySelect}
						allowedTypes = {ALLOW_MEDIA_TYPES}
						multiple = {'add'}
						value = {imageIds} // if multiple is set to 'add' this has to be an array of image Ids
						render = {({open}) => (
							<Button className="sno-gallery-block-backend-button" onClick={open}>
								Select Images
							</Button>
						)}

					
					
					
					
					/>
				</MediaUploadCheck>
			)
        }
        
        return(
            <div className="sno-gallery-block-backend-main">
				<MyGalleryUploader />
				{console.log(galleryImages, 'gallery')}
				<div className="sno-gallery-block-backend-gallery">
					{giveOutImages}
				
				</div>
				
			</div>
        );
    },


    save: (props) => {
        const {  attributes } = props;
        const {  galleryImages, galleryId } = props.attributes;
        
        const frontImages = galleryImages.length > 0 && galleryImages.map( item => 
            <a class="sno-lightbox-nqaknadj3v" data-lightbox={galleryId} href={item.sizes.full.url} ><img id={`sno-gallery-block-image-${item.id}`} class="sno-gallery-block-image"  alt={item.title} src={item.sizes.thumbnail.url}/></a>
        
        
        );
        return (
			<div id={galleryId} className="sno-gallery-lightbox-block-front">
                {frontImages}
			</div>
		);

    },
})