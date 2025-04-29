// time ago
import { formatDateWT } from "../../lib";

function UserModal({ details, setDetails }) {
  return (
    <dialog id="user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-neutral-50 text-neutral-800">
            <h3 className="font-bold text-2xl text-center">User Details</h3>
            <p className='mb-3 text-sm mt-4'><b>Full Name:</b><br />{details?.fullName}</p>
            <p className='mb-3 text-sm'><b>User ID:</b><br />{details?.id}</p>
            <p className='mb-3 text-sm'><b>Email:</b><br />{details?.email} <span className="badge badge-sm bg-blue-400 border-none text-neutral-100"><a href={`mailto:${details?.email}`} target="_blank">Email Now</a></span></p>
            <p className='mb-3 text-sm'><b>Contact Number:</b><br />{details?.contactNumber} <span className="badge badge-sm bg-blue-400 border-none text-neutral-100"><a href={`tel:${details?.contactNumber}`} target="_blank">Call Now</a></span></p>
            <p className='mb-3 text-sm'><b>Address:</b><br />{details?.userAddress}</p>
            <p className='mb-3 text-sm'><b>Date Created:</b><br />{details ? formatDateWT(details?.createdAt) : ''}</p>
            <div className="modal-action">
                <form method="dialog">
                    <button className="btn" onClick={() => setDetails(null)}>Close</button>
                </form>
            </div>
        </div>
    </dialog>
  )
}

export default UserModal;
