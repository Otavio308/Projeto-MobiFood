const Product = require('../models/Product'); // Assumindo seu modelo de produto
const path = require('path'); // Para manipulação de caminhos de arquivo
const fs = require('fs/promises'); // Para deletar arquivos (se necessário)

// Auxiliar para lidar com o upload de imagem (simples, sem multer por enquanto)
// NO FUTURO: CONSIDERE USAR MULTER PARA UPLOAD DE ARQUIVOS.
// Esta é uma implementação MUITO SIMPLIFICADA para testes sem multer.
// Você precisará de uma biblioteca robusta como `multer` para uploads reais.
const handleImageUpload = async (req, res, next) => {
    // Para simplificar drasticamente e remover a dependência de 'upload',
    // vamos assumir que não haverá upload de imagem por enquanto
    // ou que a imagem virá como uma URL/string de texto no corpo da requisição.
    // SE VOCÊ QUISER UPLOAD REAL DE IMAGENS, VOCÊ PRECISA REINTRODUZIR O MULTER
    // E CONFIGURÁ-LO.
    // Por enquanto, req.file não existirá.
    next();
};

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private (Restaurant)
exports.createProduct = [
    handleImageUpload, // Middleware auxiliar (por enquanto vazio para evitar multer)
    async (req, res) => {
        const { name, description, price, category, quantity } = req.body;

        // Verificação de role aqui, já que removemos authorizeRole
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ message: 'Acesso negado. Apenas restaurantes podem criar produtos.' });
        }

        try {
            const newProduct = new Product({
                name,
                description,
                price,
                category,
                quantity,
                restaurant: req.user._id, // Associa o produto ao ID do restaurante logado
                image: req.file ? `/uploads/${req.file.filename}` : null, // Se reintroduzir multer, use req.file
            });

            const product = await newProduct.save();
            res.status(201).json({ message: 'Produto criado com sucesso!', product });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
        }
    }
];


// @desc    Listar todos os produtos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('restaurant', 'name'); // Popula o nome do restaurante
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private (Restaurant)
exports.updateProduct = [
    handleImageUpload, // Middleware auxiliar
    async (req, res) => {
        const { name, description, price, category, quantity } = req.body;
        const productId = req.params.id;

        // Verificação de role aqui
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ message: 'Acesso negado. Apenas restaurantes podem atualizar produtos.' });
        }

        try {
            let product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            // Garante que apenas o restaurante dono pode atualizar o produto
            if (product.restaurant.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Não autorizado para atualizar este produto' });
            }

            // Atualiza campos
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.quantity = quantity || product.quantity;

            // Lógica para imagem (se reintroduzir multer)
            // if (req.file) {
            //     // Se houver uma imagem antiga, delete-a
            //     if (product.image) {
            //         const oldImagePath = path.join(__dirname, '../../', product.image);
            //         try {
            //             await fs.unlink(oldImagePath);
            //         } catch (unlinkErr) {
            //             console.warn(`Não foi possível deletar a imagem antiga: ${oldImagePath}`, unlinkErr.message);
            //         }
            //     }
            //     product.image = `/uploads/${req.file.filename}`;
            // } else if (req.body.image === 'null' && product.image) {
            //     // Se o frontend indicar para remover a imagem existente
            //     const oldImagePath = path.join(__dirname, '../../', product.image);
            //     try {
            //         await fs.unlink(oldImagePath);
            //     } catch (unlinkErr) {
            //         console.warn(`Não foi possível deletar a imagem antiga: ${oldImagePath}`, unlinkErr.message);
            //     }
            //     product.image = null;
            // }

            await product.save();
            res.json({ message: 'Produto atualizado com sucesso!', product });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
        }
    }
];

// @desc    Deletar um produto
// @route   DELETE /api/products/:id
// @access  Private (Restaurant)
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    // Verificação de role aqui
    if (req.user.role !== 'restaurant') {
        return res.status(403).json({ message: 'Acesso negado. Apenas restaurantes podem deletar produtos.' });
    }

    try {
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Garante que apenas o restaurante dono pode deletar o produto
        if (product.restaurant.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Não autorizado para deletar este produto' });
        }

        // Se o produto tiver uma imagem, você pode querer deletá-la do servidor
        // if (product.image) {
        //     const imagePath = path.join(__dirname, '../../', product.image);
        //     try {
        //         await fs.unlink(imagePath);
        //     } catch (unlinkErr) {
        //         console.warn(`Não foi possível deletar a imagem: ${imagePath}`, unlinkErr.message);
        //     }
        // }

        await Product.deleteOne({ _id: productId });
        res.json({ message: 'Produto removido com sucesso!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};