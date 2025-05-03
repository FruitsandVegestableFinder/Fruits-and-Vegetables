import { useEffect, useState } from 'react'

function SupplyLists({ supplies, checkedItems, setCheckedItems }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
    const handleFilterChange = (e) => setFilter(e.target.value);

    const filteredItems = supplies.filter((item) => {
        return (
          (filter.toLowerCase() == 'all' || item.type.toLowerCase() == filter.toLowerCase()) &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleCheckboxChange = (id) => {
        const newData = checkedItems.includes(id) ? checkedItems.filter(itemId => itemId !== id) : [...checkedItems, id];
        setSelectAllChecked(newData.length == supplies.length);
        setCheckedItems(newData);
    }

    const handleSelectAllChange = (e) => {
        const isChecked = e.target.checked;
        setSelectAllChecked(isChecked);
        if (isChecked) {
          setCheckedItems(supplies.map(item => item.id));
        } else {
          setCheckedItems([]);
        }
    };

    useEffect(() => {
        setSelectAllChecked(checkedItems.length == supplies.length);
    },[checkedItems])

    return (
        <div className="py-6 px-6 border rounded-xl mt-4">
            <h1 className='mb-4 text-center'>Supply Lists</h1>
            <div className="flex items-center mb-4 gap-4">
                <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                    className="ml-4 checkbox checkbox-md"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered w-full"
                    onChange={handleSearchChange}
                    value={searchTerm}
                />

                <select
                    className="select select-bordered"
                    onChange={handleFilterChange}
                    value={filter}
                >
                    <option value="all">All</option>
                    <option value="fruit">Fruits</option>
                    <option value="vegetable">Vegetables</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto mb-4">
                {filteredItems.map((item, i) => (
                <label key={i} className={`${checkedItems.includes(item.id) ? 'border bg-neutral-100' : 'border border-white'} cursor-pointer label justify-start px-2 rounded items-center`}>
                    <input
                        type="checkbox"
                        className="checkbox checkbox-default hidden"
                        checked={checkedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                    />
                    <img src={item.imgUrl} alt={item.name} className="object-contain w-10 h-10 rounded" />
                    <span className="ml-2">{item.name}</span>
                </label>
                ))}
            </div>
        </div>
    )
}

export default SupplyLists
