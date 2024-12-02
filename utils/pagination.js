const paginationHelper = async(model,query, perPage,populate) =>{
    const page = parseInt(query)|| 1; // Get the current page from query parameters
    console.log(page);
    const totalPosts = await model.countDocuments(); // Count total documents in the model
    console.log(totalPosts)
    const totalPages = Math.ceil(totalPosts / perPage); // Calculate total pages

    let errorPagination = true;
    // Check if the requested page exceeds total pages
    if (page > totalPages || page <= 0) {
        return errorPagination = false;
    }

    // Fetch the paginated results
    const items = await model.find()
        .skip((page - 1) * perPage) // Skip items for previous pages
        .limit(perPage) // Limit to the number of items per page
        .populate(populate)
        .exec();

    return {
        items,
        currentPage: page,
        totalPages,
        totalPosts,
        errorPagination
    };
}

export default paginationHelper;

