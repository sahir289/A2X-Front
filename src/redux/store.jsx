import { configureStore } from '@reduxjs/toolkit'
import headerSlice from './slice/headerSlice'
// import modalSlice from '../features/common/modalSlice'
// import rightDrawerSlice from '../features/common/rightDrawerSlice'
// import leadsSlice from '../features/leads/leadSlice'

const combinedReducer = {
    header: headerSlice,
    // rightDrawer: rightDrawerSlice,
    // modal: modalSlice,
    // lead: leadsSlice
}

export default configureStore({
    reducer: combinedReducer
})
