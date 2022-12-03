import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// lib
import palette from '../lib/styles/palette';
// types
import Book from '../types/book';
import Highlight, { Color } from '../types/highlight';
import Page from '../types/page';
import Toc from '../types/toc';

/* 
	Initial State
*/

/** 초기 Book 상태 */
const initialBook: Book = {
    coverURL: '',
    title: '',
    description: '',
    published_date: '',
    modified_date: '',
    author: '',
    publisher: '',
    language: '',
};

/** 초기 CurrentPage 상태 */
const initialCurrentLocation: Page = {
    chapterName: '-',
    currentPage: 0,
    totalPage: 0,
    startCfi: '',
    endCfi: '',
    base: '',
};


const initialState: BookState = {
    book: initialBook,
    currentLocation: initialCurrentLocation,
    toc: [],
    highlights: [],
};

/* 
	Slice
*/
const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        /** Book 갱신 @dispatch */
        updateBook(state, action: PayloadAction<Book>) {
            state.book = action.payload;
        },
        /** CurrentPage 갱신 @dispatch */
        updateCurrentPage(state, action: PayloadAction<Page>) {
            state.currentLocation = action.payload;
        },
        /** Book 초기화 @dispatch */
        clearBook(state) {
            state.book = initialBook;
        },
        /** 목차 갱신 @dispatch */
        updateToc(state, action: PayloadAction<Toc[]>) {
            state.toc = action.payload;
        },
        /** 목차 초기화 @dispatch */
        clearToc(state) {
            state.toc = [];
        },
        /** 하이라이트 추가 */
        pushHighlight(state, action: PayloadAction<Highlight>) {
            const check = state.highlights.filter((h) => h.key === action.payload.key);
            if (check.length > 0) return;
            state.highlights.push(action.payload);
        },
        /** 하이라이트 갱신 */
        updateHighlight(state, action: PayloadAction<Highlight>) {
            const new_idx = action.payload.key;
            const old_idx = state.highlights.map((h) => h.key).indexOf(new_idx);
            state.highlights.splice(old_idx, 1, action.payload);
        },
        /** 하이라이트 삭제 */
        popHighlight(state, action: PayloadAction<string>) {
            const idx = state.highlights.map((h) => h.key).indexOf(action.payload);
            state.highlights.splice(idx, 1);
        },
    },
});

export interface BookState {
    book: Book;
    currentLocation: Page;
    toc: Toc[];
    highlights: Highlight[];
}

export const {
    updateBook,
    clearBook,
    updateCurrentPage,
    updateToc,
    clearToc,
    pushHighlight,
    updateHighlight,
    popHighlight,
} = bookSlice.actions;

export default bookSlice.reducer;
