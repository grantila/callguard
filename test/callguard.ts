'use strict';

import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { asyncGuard, syncGuard } from '../index';

function immediate( )
{
	return new Promise( resolve => setImmediate( resolve ) );
}

async function rejection( promise: Promise< any > ): Promise< Error >
{
	try
	{
		await promise;
	}
	catch ( err )
	{
		return err;
	}
	/* istanbul ignore next */
	throw new Error( "Expected promise to contain exception" );
}

describe( 'sync', ( ) =>
{
	it( 'should allow success flow through with undefined', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => void( 0 ) )( );

		expect( ret ).to.be.undefined;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow success flow through with null', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => null )( );

		expect( ret ).to.be.null;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow success flow through with value', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => "foo" )( );

		expect( ret ).to.equal( "foo" );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward zero arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => { } )( );

		expect( ret ).to.be.undefined;
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward one argument', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( value: string ) => value )( "foo" );

		expect( ret ).to.equal( "foo" );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward multiple arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const ret = fn( ( a: number, b: string ) => ( [ a, b ] ) )( 42, "x" );

		expect( ret ).to.deep.equal( [ 42, "x" ] );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward 8 arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = syncGuard( spy );
		const caller =
			(
				a: number,
				b: string,
				c: number,
				d: string,
				e: number,
				f: string,
				g: number,
				h: string
			) => ( [ a, b, c, d, e, f, g, h ] );
		const ret = fn( caller )( 1, "a", 2, "b", 3, "c", 4, "d" );

		expect( ret ).to.deep.equal( [ 1, "a", 2, "b", 3, "c", 4, "d" ] );
		sinon.assert.notCalled( spy );
	} );

	describe( 'default return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.be.null;
			sinon.assert.calledWith( spy, err );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy, { longStackTraces: true } );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.be.null;
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );

		it( 'should not catch async errors if not wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.be.null;
			sinon.assert.notCalled( spy );
		} );

		it( 'should catch async errors if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy, { catchAsync: true } );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.be.null;
			sinon.assert.calledWith( spy, theError );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard(
				spy,
				{ catchAsync: true, longStackTraces: true } );

			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.be.null;
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );
	} );

	describe( 'custom return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy, { defaultReturn: "bar" } );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledWith( spy, err );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = syncGuard(
				spy,
				{ defaultReturn: "bar", longStackTraces: true } );

			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );

		it( 'should not catch async errors if not wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy, { defaultReturn: "bar" } );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.equal( "bar" );
			sinon.assert.notCalled( spy );
		} );

		it( 'should catch async errors if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard(
				spy,
				{ defaultReturn: "bar", catchAsync: true } );

			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.equal( "bar" );
			sinon.assert.calledWith( spy, theError );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard(
				spy,
				{
					defaultReturn: "bar",
					catchAsync: true,
					longStackTraces: true
				} );

			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).to.not.equal( "bar" );
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );
	} );
} );

describe( 'async', ( ) =>
{
	it( 'should allow sync success flow through with undefined', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => void( 0 ) )( );

		expect( ret ).to.be.undefined;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow sync success flow through with null', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => null )( );

		expect( ret ).to.be.null;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow sync success flow through with value', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => "foo" )( );

		expect( ret ).to.equal( "foo" );
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow async success flow through with undefined', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( void( 0 ) ) )( );

		expect( ret ).to.be.undefined;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow async success flow through with null', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( null ) )( );

		expect( ret ).to.be.null;
		sinon.assert.notCalled( spy );
	} );

	it( 'should allow async success flow through with value', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( "foo" ) )( );

		expect( ret ).to.equal( "foo" );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward zero arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => { } )( );

		expect( ret ).to.be.undefined;
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward one argument', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( s: string ) => s )( "foo" );

		expect( ret ).to.equal( "foo" );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward multiple arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( a: number, b: string ) => ( [ a, b ] ) )
			( 42, "x" );

		expect( ret ).to.deep.equal( [ 42, "x" ] );
		sinon.assert.notCalled( spy );
	} );

	it( 'should forward 8 arguments', async ( ) =>
	{
		const spy = sinon.spy( );

		const fn = asyncGuard( spy );
		const caller =
			(
				a: number,
				b: string,
				c: number,
				d: string,
				e: number,
				f: string,
				g: number,
				h: string
			) => ( [ a, b, c, d, e, f, g, h ] );
		const ret = await fn( caller )( 1, "a", 2, "b", 3, "c", 4, "d" );

		expect( ret ).to.deep.equal( [ 1, "a", 2, "b", 3, "c", 4, "d" ] );
		sinon.assert.notCalled( spy );
	} );

	describe( 'default return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy );
			const ret = await fn( ( ): Promise< void > =>
			{
				throw err;
			} )( );

			expect( ret ).to.be.null;
			sinon.assert.calledWith( spy, err );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy, { longStackTraces: true } );
			const ret = await fn( ( ): Promise< void > =>
			{
				throw err;
			} )( );

			expect( ret ).to.be.null;
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );

		it( 'should catch async errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy );
			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} ) ( );

			await immediate( );

			expect( ret ).to.be.null;
			sinon.assert.calledWith( spy, theError );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy, { longStackTraces: true } );

			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} )( );

			await immediate( );

			expect( ret ).to.be.null;
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );
	} );

	describe( 'custom return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy, { defaultReturn: "bar" } );
			const ret = await fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledWith( spy, err );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = new Error( "foo" );

			const fn = asyncGuard(
				spy,
				{ defaultReturn: "bar", longStackTraces: true } );

			const ret = await fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );

		it( 'should catch async errors', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy, { defaultReturn: "bar" } );

			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} )( );

			await immediate( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledWith( spy, theError );
			expect( spy.args[ 0 ][ 0 ].stack ).not.to.contain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = sinon.spy( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard(
				spy,
				{ defaultReturn: "bar", longStackTraces: true } );

			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} )( );

			await immediate( );

			expect( ret ).to.equal( "bar" );
			sinon.assert.calledOnce( spy );
			expect( spy.args[ 0 ][ 0 ].stack ).to.contain( "[callguard]" );
		} );
	} );
} );

describe( 'errors', ( ) =>
{
	it( 'should print to console.error when internal error handler throws',
		async ( ) =>
	{
		const oldError = console.error;

		const spy = sinon.spy( );

		console.error = spy;

		const fn = syncGuard( ( err ) => { throw new Error( "foo" ) } );
		const ret = fn( ( ) => { throw new Error( "bar" ) } )( );

		sinon.assert.calledTwice( spy );
		expect( spy.args[ 0 ][ 0 ] ).to.contain( "[callguard" );
		expect( spy.args[ 0 ][ 1 ].message ).to.contain( "foo" );
		expect( spy.args[ 1 ][ 0 ] ).to.contain( "[callguard" );
		expect( spy.args[ 1 ][ 1 ].message ).to.contain( "bar" );

		console.error = oldError;
	} );

	it( 'should print to console.error when non-Error is thrown',
		async ( ) =>
	{
		const oldError = console.error;

		const guardSpy = sinon.spy( );
		const spy = sinon.spy( );

		console.error = spy;

		const fn = syncGuard( guardSpy, { longStackTraces: true } );
		const ret = fn( ( ) => { throw void 0; } )( );

		sinon.assert.notCalled( guardSpy );
		sinon.assert.calledOnce( spy );
		expect( spy.args[ 0 ][ 0 ] ).to.contain( "probably caused" );

		console.error = oldError;
	} );
} );
