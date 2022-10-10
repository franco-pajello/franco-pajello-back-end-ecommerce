class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros =[{nombre:libros,
        autor:"no definido"}]
        this.mascotas = [mascotas]
    }
    getFullName() {

        console.log(`${this.nombre} ${this.apellido}`)

    }
    addMascota(mascota) {

        this.mascotas.push(mascota)

        return console.log(this.mascotas)

    }

    countMascotas() {

        console.log(this.mascotas.length)
    }

    addBook(nombre, autor) {

        this.libros.push({
            nombre: nombre,
            autor: autor
        })

        return console.log(this.libros)

    }

    getBookNames() {

let nombresLibros = this.libros.map((e) =>e.nombre )
return console.log(nombresLibros)

}
}

const obj = new Usuario("Franco", "Pajello", "El señor de los anillos", "gato")

console.log(obj.nombre)
console.log(obj.apellido)
console.log(obj.libros)
console.log(obj.mascotas)
obj.getFullName()
obj.addMascota("perro")
obj.countMascotas()
obj.addBook("It", "Stephen King")
obj.getBookNames() 
