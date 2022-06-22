import React from 'react';
import fetchImg from '../API/ImagesApi';
import Searchbar from './Searchbar/SearchBar';
// import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';

export default class App extends React.Component {
  state = {
    searchQuery: '',
    images: [],
    status: 'idle',
    pageNumber: 1,
    showLoadMoreButton: false,
    showModal: false,
    errorMsg: '',
    src: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, pageNumber } = this.state;
    if (prevState.searchQuery !== searchQuery) {
      this.setState({ images: [], status: 'pending', pageNumber: 1 }, () =>
        this.generateSearchQueryResult(searchQuery, this.state.pageNumber)
      );
    }
    if (prevState.pageNumber !== pageNumber && pageNumber !== 1) {
      this.generateSearchQueryResult(searchQuery, pageNumber);
    }
  }

  generateSearchQueryResult = (searchQuery, pageNumber) => {
    fetchImg(searchQuery, pageNumber)
      .then(data => {
        if (data.hits.length === 0) {
          this.setState({
            status: 'rejected',
            errorMsg: 'Зображень по запиту не знайдено',
          });
        } else {
          const totalPages = Math.ceil(data.total / 12);
          const usableImageKeysArr = data.hits.map(
            ({ id, webformatURL, largeImageURL }) => {
              return {
                id,
                webformatURL,
                largeImageURL,
              };
            }
          );

          this.setState(prevState => ({
            images: [...prevState.images, ...usableImageKeysArr],
            status: 'resolved',
            showLoadMoreButton: totalPages === pageNumber ? false : true,
          }));

          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      })
      .catch(err => {
        this.setState({
          status: 'rejected',
          errorMsg: `Трапилася помилка: ${err}`,
        });
      });
  };

  onSearch = query => {
    this.setState({ searchQuery: query });
  };

  onOpenModal = img => {
    if (img.className.includes('ImageGalleryItem__image')) {
      this.setState({ showModal: true, src: img.dataset.src });
    }
  };

  onCloseModal = () => {
    this.setState({ showModal: false, src: '' });
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + 1,
      status: 'pending',
    }));
  };

  render() {
    const { images, status, showLoadMoreButton, errorMsg, showModal, src } =
      this.state;
    return (
      <>
        <Searchbar onSearch={this.onSearch} />
        {status === 'idle' && <p className="Msg">Введіть пошуковий запит</p>}
        {status === 'pending' && (
          <>
            {images.length !== 0 && <ImageGallery imgArr={images} />}
            {/* <Loader /> */}
            <div className="loadMoreReplacer"></div>
          </>
        )}
        {status === 'rejected' && <p className="Msg">{errorMsg}</p>}
        {status === 'resolved' && (
          <>
            <ImageGallery imgArr={images} onOpenModal={this.onOpenModal} />
            {showLoadMoreButton && <Button onLoadMore={this.onLoadMore} />}
          </>
        )}
        {showModal && (
          <Modal onClose={this.onCloseModal}>
            <img src={src} alt="" />
          </Modal>
        )}
      </>
    );
  }
}
