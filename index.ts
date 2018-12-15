'use strict'

function handle(
	handler: ( err: Error ) => void,
	err: Error,
	stacks: ReadonlyArray< string | undefined >
)
: void
{
	try
	{
		const handledErr = stacks.length === 0 ? err : Object.create( err );

		if ( stacks.length > 0 )
		{
			handledErr.stack =
				[ ...stacks, err.stack ]
				.join( "\nFrom:\n" )
				.replace( "\n\n", "\n" );
		}

		try
		{
			handler( handledErr );
		}
		catch ( err )
		{
			console.error( "[callguard 1/2]: guard handler threw error", err );
			console.error( "[callguard 2/2]: while handling", handledErr );
		}
	}
	catch ( err )
	{
		console.error(
			"[callguard] handle error (probably caused by non-Error throw)]",
			err
		);
	}
}

export interface SharedGuardOptions
{
	defaultReturn: any;       // defaults to null
	longStackTraces: boolean; // defaults to false, enable for easier debugging
}

export interface SyncGuardOptions extends SharedGuardOptions
{
	catchAsync: boolean; // defaults to false
}

export interface AsyncGuardOptions extends SharedGuardOptions
{
}


export type GuardedFunction< R, T > =
	( ...args: Array< T > ) =>
		R;

export type GuardedFunctionMaker =
	< R, T >( fn: ( ...args: Array< T > ) => R ) =>
		GuardedFunction< R, T >;

export type GuardedAsyncFunction< R, T > =
	( ...args: Array< T > ) =>
		R | PromiseLike< R >;

export type GuardedAsyncFunctionMaker =
	< R, T >( fn: ( ...args: Array< T > ) => R | PromiseLike< R > ) =>
		GuardedAsyncFunction< R, T >;


export function syncGuard(
	handler: ( err: Error ) => void,
	opts?: Partial< SyncGuardOptions >
)
: GuardedFunctionMaker
{
	const captureCallstacks = opts && !!opts.longStackTraces;
	const defaultReturn = ( opts && opts.defaultReturn != null )
		? opts.defaultReturn
		: null;
	const stacks: Array< string | undefined > = [ ];

	return function< R, T >( fn: ( ...args: Array< T > ) => R )
	: GuardedFunction< R, T >
	{
		if ( captureCallstacks )
			stacks.push( ( new Error( "[callguard]" ) ).stack );

		return function( ...args ): R
		{
			if ( captureCallstacks )
				stacks.push( ( new Error( "[callguard]" ) ).stack );

			try
			{
				const ret = fn( ...args );

				if ( opts && opts.catchAsync )
				{
					Promise.resolve( ret )
					.catch( err => handle( handler, err, stacks ) );
				}

				return ret;
			}
			catch ( err )
			{
				handle( handler, err, stacks );
				return defaultReturn;
			}
		}
	}
}

export function asyncGuard(
	handler: ( err: Error ) => void,
	opts?: Partial< AsyncGuardOptions >
)
: GuardedAsyncFunctionMaker
{
	const captureCallstacks = opts && !!opts.longStackTraces;
	const defaultReturn = ( opts && opts.defaultReturn != null )
		? opts.defaultReturn
		: null;
	const stacks: Array< string | undefined > = [ ];

	return function< R, T >( fn: ( ...args: Array< T > ) => R | PromiseLike< R > )
	: GuardedAsyncFunction< R, T >
	{
		if ( captureCallstacks )
			stacks.push( ( new Error( "[callguard]" ) ).stack );

		return function( ...args ): Promise< R >
		{
			if ( captureCallstacks )
				stacks.push( ( new Error( "[callguard]" ) ).stack );

			try
			{
				return Promise.resolve( fn( ...args ) )
				.catch( err =>
				{
					handle( handler, err, stacks );
					return defaultReturn;
				} );
			}
			catch ( err )
			{
				handle( handler, err, stacks );
				return defaultReturn;
			}
		}
	}
}
