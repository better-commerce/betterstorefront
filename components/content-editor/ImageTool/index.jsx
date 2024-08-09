import ReactDOM from 'react-dom';

//
import { SvgImageIcon } from '../config';

/**
 * The ImageTool plugin is an independent code from all the React components in the project.
 * That is why, ReactDOM and Redux wrapper is used to utilize our own React components.
 */

export default class ImageTool {
  /**
   * This is a built-in method and displays the label and icon.
   */
  static get toolbox() {
    return {
      title: 'Image',
      icon: SvgImageIcon,
    };
  }

  static get isReadOnlySupported() {
    return true
  }

  /**
   * @param {*} props 
   */
  constructor (props) {
    const { data, api, buttonText } = props
    this.api = api;
    this.data = data;
    this.buttonText = buttonText || 'Select Image';
    this.rootNode = undefined;
  }

  /**
   * Renders the root node which consists whether the image button or selected image view
   * @returns root DOM node
   */
  render() {
    this.rootNode = document.createElement('div');
    if (this.rootNode && this.rootNode.setAttribute) {
      this.rootNode.setAttribute('class', 'simple-image');
    }
    // check if image URL is already provided, then display the image view
    if (this.data && this.data.url) {
      this._renderImgLoader();
      const img = new Image();
      img.src = this.data.url;
      img.onload = () => {
        this._renderImgView(img);
        return this.rootNode;
      };
      return this.rootNode;
    }
    this._renderSelectImgButton();
    return this.rootNode;
  }

  /**
   * Renders react loader component
   */
  _renderImgLoader() {
    createRoot(<p>Loading image...</p>, this.rootNode);
  }

  /**
   * Renders image button
   */
  _renderSelectImgButton() {
    const button = document.createElement('button');
    button.setAttribute('class', 'cdx-button');
    button.innerHTML += SvgImageIcon; // append icon
    button.innerHTML += this.buttonText; // append button text
    const _setImageUrl = (imgUrl) => {
      if (!imgUrl) {
        // delete the block if no URL was provided
        return this.api.blocks.delete();
      }
      this._renderImgLoader();
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        this._renderImgView(img);
      };
    }
    this.rootNode.appendChild(button);
  }

  /**
   * Renders the selected image
   * @param {*} image - DOM node
   */
  _renderImgView(image) {
    this.rootNode.innerHTML = '';
    this.rootNode.appendChild(image);
  }

  /**
   * This is a built-in method and outputs the saved data.
   * @param {*} blockContent 
   * @returns selected image data
   */
  save(blockContent){
    const image = blockContent.querySelector('img');
    return {
      url: image?.src,
    }
  }
}
