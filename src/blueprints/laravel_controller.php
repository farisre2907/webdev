<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MerchandiseController extends Controller
{
    /**
     * Authenticate and Login User.
     * Accessible on: POST /api/auth/login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'role' => 'required|in:customer,staff'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Input data tidak valid',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', strtolower($request->email))
                    ->where('role', $request->role)
                    ->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email tidak terdaftar atau peranan (role) Anda tidak sesuai!'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'user' => [
                'id' => $user->id,
                'fullName' => $user->fullName,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    /**
     * Register User.
     * Accessible on: POST /api/auth/register
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:customer,staff'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal, email mungkin sudah digunakan.',
                'errors' => $validator->errors()
            ], 400);
        }

        $userId = 'USR-' . Str::random(10);
        $user = User::create([
            'id' => $userId,
            'fullName' => $request->fullName,
            'email' => strtolower($request->email),
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi akun baru berhasil disimpan di database!',
            'user' => $user
        ], 201);
    }

    /**
     * Get All Products with Category details.
     * Accessible on: GET /api/products
     */
    public function getProducts()
    {
        $products = Product::with('category')->get();
        return response()->json($products);
    }

    /**
     * Post a New Order.
     * Accessible on: POST /api/orders
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|exists:users,id',
            'totalAmount' => 'required|integer',
            'items' => 'required|array',
            'items.*.productId' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Transaksi tidak valid', 'errors' => $validator->errors()], 400);
        }

        $orderId = 'ORD-' . rand(1000, 9999);
        $order = Order::create([
            'id' => $orderId,
            'userId' => $request->userId,
            'totalAmount' => $request->totalAmount,
            'paymentStatus' => 'Paid',
            'orderStatus' => 'Completed'
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'id' => 'ORI-' . Str::random(10),
                'orderId' => $orderId,
                'productId' => $item['productId'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
            
            // Deduct stock
            $prod = Product::find($item['productId']);
            if ($prod) {
                $prod->decrement('stock', $item['quantity']);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pesanan berhasil diproses di Laravel MySQL backend!',
            'orderId' => $orderId
        ]);
    }
}
