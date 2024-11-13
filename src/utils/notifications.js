import Swal from 'sweetalert2'

export const showModal = async (options) => {
  return Swal.fire(options)
}

export const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message
  })
} 