import React from 'react'

const UnauthorizedPage = () => {
  return (
    <div className="p-6 text-center text-red-600">
      <h2 className="text-2xl font-bold">403 - Access Denied</h2>
      <p>You are not authorized to view this page.</p>
    </div>
  )
}

export default UnauthorizedPage
