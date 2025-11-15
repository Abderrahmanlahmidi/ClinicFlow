export const HandleSearch = (data, searchTerm) => {
     return searchTerm
        ? data.filter(item =>
            Object.values(item)
                .join('')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        : data;
}