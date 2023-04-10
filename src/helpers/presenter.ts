export function getLocaleDateString(date: Date) {
    return new Date(date).toLocaleDateString('es-MX')
}

export function getCategoriesNames(categories) {
    const arr = []

    categories.map(category => {
        arr.push(category.category.name)
    })

    return arr.join(', ')
}