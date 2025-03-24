export const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem('saved_books')
      ? JSON.parse(localStorage.getItem('saved_books')!)
      : [];
  
    return savedBookIds;
  };
  
  export const saveBookId = (bookId: string) => {
    const savedBookIds = localStorage.getItem('saved_books')
      ? JSON.parse(localStorage.getItem('saved_books')!)
      : [];
  
    if (!savedBookIds.includes(bookId)) {
      savedBookIds.push(bookId);
      localStorage.setItem('saved_books', JSON.stringify(savedBookIds));
    }
  };
  
  export const removeBookId = (bookId: string) => {
    const savedBookIds = localStorage.getItem('saved_books')
      ? JSON.parse(localStorage.getItem('saved_books')!)
      : [];
  
    const updatedSavedBookIds = savedBookIds.filter((id: string) => id !== bookId);
    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
  };
  