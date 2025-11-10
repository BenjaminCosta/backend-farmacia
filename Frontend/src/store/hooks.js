import { useDispatch, useSelector } from 'react-redux';

// Hooks tipados para usar en toda la app
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
