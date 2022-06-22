import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import s from './ImageGallery.module.css';

export default function ImageGallery({ imgArr, onOpenModal }) {
  return (
    <ul className={s.ImageGallery} onClick={e => onOpenModal(e.target)}>
      {imgArr.map(({ id, webformatURL, largeImageURL }, index) => (
        <li key={index} className={s.ImageGalleryItem}>
          <ImageGalleryItem
            id={id}
            webformatURL={webformatURL}
            largeImageURL={largeImageURL}
          />
        </li>
      ))}
    </ul>
  );
}

ImageGallery.propTypes = {
  imgArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  onOpenModal: PropTypes.func,
};
