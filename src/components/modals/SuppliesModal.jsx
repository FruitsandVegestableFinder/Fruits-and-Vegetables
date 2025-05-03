function Supplies({ details, setDetails, handleSubmit, handleImageChange, preview, image, err, setErr, isDisabled }) {
    return (
        <dialog id="supplies_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-neutral-50 text-neutral-500">
                <h3 className="font-bold text-xl text-center mb-4">{details?.action} Supply</h3>
                <input type="text" value={details?.name} onChange={(e) => {
                    setDetails(prev => ({...prev, name: e.target.value}));
                    setErr(null);
                }} placeholder='Name' className='mb-4 input input-bordered input-md w-full text-neutral-500' />
                {err && <h3 className="text-sm text-center mb-4 text-red-400">{err}</h3>}
                <label>Select Type: </label>
                <select value={details?.type} onChange={(e) => setDetails(prev => ({...prev, type: e.target.value}))} className='mt-1 select select-bordered select-md w-full text-neutral-500'>
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                </select>

                {/* upload image */}
                <div className="mt-2">
                    <label>Upload Image: </label>
                    <input type="file" className='file-input file-input-bordered w-full' id='supply_img' onChange={handleImageChange} accept=".jpg, .jpeg, .png, .gif" />
                </div>

                {/* image preview */}
                <div className='mt-2'>
                    {preview && 
                    <div className='flex flex-wrap'>
                        <img src={preview} alt={`Preview Image`} className='w-full object-contain aspect-video' />
                    </div>
                    }
                </div>
                <div className="modal-action">
                    {(details?.name == '' || (image == null && details?.action == 'Add')) ?
                        <button className="btn btn-success text-neutral-100 mr-3" disabled>Save</button>
                        :
                        <button className="btn btn-success text-neutral-100 mr-3" onClick={handleSubmit} disabled={isDisabled}>{isDisabled ? 'Saving' : 'Save'}</button>
                    }
                    <button className="btn" onClick={() => {
                        setDetails({ action: '', name: '', type: 2, id: null });
                        document.getElementById('supplies_modal').close();
                        setErr(null);
                    }}>Close</button>
                </div>
            </div>
        </dialog>
    )
}

export default Supplies;
