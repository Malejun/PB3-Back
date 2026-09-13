import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/products.service.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

export async function getProductsController(req, res, next) {
  try {
    const data = await getAllProducts();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const data = await createProduct({ ...req.body, image: imageUrl });
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateProductController(req, res, next) {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const productData = { ...req.body };
    if (imageUrl) {
      productData.image = imageUrl;
    }
    const data = await updateProduct(req.params.id, productData);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const data = await deleteProduct(req.params.id);
    res.json({ ok: true, data, message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
}

export async function uploadImageController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se envió ninguna imagen' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ ok: true, url: result.secure_url, data: { url: result.secure_url } });
  } catch (error) {
    next(error);
  }
}
