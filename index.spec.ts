import { asyncGuard, syncGuard } from './index';

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
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => void( 0 ) )( );

		expect( ret ).toBeUndefined( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow success flow through with null', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => null )( );

		expect( ret ).toBeNull( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow success flow through with value', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => "foo" )( );

		expect( ret ).toEqual( "foo" );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward zero arguments', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( ) => { } )( );

		expect( ret ).toBeUndefined( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward one argument', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( value: string ) => value )( "foo" );

		expect( ret ).toEqual( "foo" );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward multiple arguments', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = syncGuard( spy );
		const ret = fn( ( a: number, b: string ) => ( [ a, b ] ) )( 42, "x" );

		expect( ret ).toStrictEqual( [ 42, "x" ] );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward 8 arguments', async ( ) =>
	{
		const spy = jest.fn( );

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

		expect( ret ).toStrictEqual( [ 1, "a", 2, "b", 3, "c", 4, "d" ] );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	describe( 'default return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( err );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy, { longStackTraces: true } );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );

		it( 'should not catch async errors if not wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).not.toBeNull( );
			expect( spy.mock.calls.length ).toBe( 0 );
		} );

		it( 'should catch async errors if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy, { catchAsync: true } );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).not.toBeNull( );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( theError );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

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

			expect( ret ).not.toBeNull( );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );
	} );

	describe( 'custom return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = syncGuard( spy, { defaultReturn: "bar" } );
			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( err );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = syncGuard(
				spy,
				{ defaultReturn: "bar", longStackTraces: true } );

			const ret = fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );

		it( 'should not catch async errors if not wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = syncGuard( spy, { defaultReturn: "bar" } );
			const ret = fn( ( ): void =>
			{
				// Evil evil user
				return < void >< any >err;
			} )( );

			await immediate( );

			expect( ret ).not.toEqual( "bar" );
			expect( spy.mock.calls.length ).toBe( 0 );
		} );

		it( 'should catch async errors if wanted', async ( ) =>
		{
			const spy = jest.fn( );

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

			expect( ret ).not.toEqual( "bar" );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( theError );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

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

			expect( ret ).not.toEqual( "bar" );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );
	} );
} );

describe( 'async', ( ) =>
{
	it( 'should allow sync success flow through with undefined', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => void( 0 ) )( );

		expect( ret ).toBeUndefined( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow sync success flow through with null', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => null )( );

		expect( ret ).toBeNull( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow sync success flow through with value', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => "foo" )( );

		expect( ret ).toEqual( "foo" );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow async success flow through with undefined', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( void( 0 ) ) )( );

		expect( ret ).toBeUndefined( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow async success flow through with null', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( null ) )( );

		expect( ret ).toBeNull( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should allow async success flow through with value', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => Promise.resolve( "foo" ) )( );

		expect( ret ).toEqual( "foo" );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward zero arguments', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( ) => { } )( );

		expect( ret ).toBeUndefined( );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward one argument', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( s: string ) => s )( "foo" );

		expect( ret ).toEqual( "foo" );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward multiple arguments', async ( ) =>
	{
		const spy = jest.fn( );

		const fn = asyncGuard( spy );
		const ret = await fn( ( a: number, b: string ) => ( [ a, b ] ) )
			( 42, "x" );

		expect( ret ).toStrictEqual( [ 42, "x" ] );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	it( 'should forward 8 arguments', async ( ) =>
	{
		const spy = jest.fn( );

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

		expect( ret ).toStrictEqual( [ 1, "a", 2, "b", 3, "c", 4, "d" ] );
		expect( spy.mock.calls.length ).toBe( 0 );
	} );

	describe( 'default return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy );
			const ret = await fn( ( ): Promise< void > =>
			{
				throw err;
			} )( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( err );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy, { longStackTraces: true } );
			const ret = await fn( ( ): Promise< void > =>
			{
				throw err;
			} )( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );

		it( 'should catch async errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy );
			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} ) ( );

			await immediate( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( theError );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy, { longStackTraces: true } );

			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} )( );

			await immediate( );

			expect( ret ).toBeNull( );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );
	} );

	describe( 'custom return value', ( ) =>
	{
		it( 'should catch sync errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = asyncGuard( spy, { defaultReturn: "bar" } );
			const ret = await fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( err );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch sync errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

			const err = new Error( "foo" );

			const fn = asyncGuard(
				spy,
				{ defaultReturn: "bar", longStackTraces: true } );

			const ret = await fn( ( ): void =>
			{
				throw err;
			} )( );

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );

		it( 'should catch async errors', async ( ) =>
		{
			const spy = jest.fn( );

			const err = Promise.reject( new Error( "foo" ) );
			const theError = await rejection( err );

			const fn = asyncGuard( spy, { defaultReturn: "bar" } );

			const ret = await fn( ( ): Promise< void > =>
			{
				return err;
			} )( );

			await immediate( );

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls[ 0 ][ 0 ] ).toBe( theError );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).not.toContain( "[callguard]" );
		} );

		it( 'should catch async errors with long stack if wanted', async ( ) =>
		{
			const spy = jest.fn( );

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

			expect( ret ).toEqual( "bar" );
			expect( spy.mock.calls.length ).toBe( 1 );
			expect( spy.mock.calls[ 0 ][ 0 ].stack ).toContain( "[callguard]" );
		} );
	} );
} );

describe( 'errors', ( ) =>
{
	it( 'should print to console.error when internal error handler throws',
		async ( ) =>
	{
		const oldError = console.error;

		const spy = jest.fn( );

		console.error = spy;

		const fn = syncGuard( ( err ) => { throw new Error( "foo" ) } );
		const ret = fn( ( ) => { throw new Error( "bar" ) } )( );

		expect( spy.mock.calls.length ).toBe( 2 );
		expect( spy.mock.calls[ 0 ][ 0 ] ).toContain( "[callguard" );
		expect( spy.mock.calls[ 0 ][ 1 ].message ).toContain( "foo" );
		expect( spy.mock.calls[ 1 ][ 0 ] ).toContain( "[callguard" );
		expect( spy.mock.calls[ 1 ][ 1 ].message ).toContain( "bar" );

		console.error = oldError;
	} );

	it( 'should print to console.error when non-Error is thrown',
		async ( ) =>
	{
		const oldError = console.error;

		const guardSpy = jest.fn( );
		const spy = jest.fn( );

		console.error = spy;

		const fn = syncGuard( guardSpy, { longStackTraces: true } );
		const ret = fn( ( ) => { throw void 0; } )( );

		expect( guardSpy.mock.calls.length ).toBe( 0 );
		expect( spy.mock.calls.length ).toBe( 1 );
		expect( spy.mock.calls[ 0 ][ 0 ] ).toContain( "probably caused" );

		console.error = oldError;
	} );
} );
