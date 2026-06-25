'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { lstoCart } from '@/redux/features/CartSlice'

export default function CartInitializer() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(lstoCart())
  }, [dispatch])
  return null
}