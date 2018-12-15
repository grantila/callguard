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


export type GuardedFunction0< R > =
	( ) =>
		R;
export type GuardedFunction1< R, T1 > =
	( t1: T1 ) =>
		R;
export type GuardedFunction2< R, T1, T2 > =
	( t1: T1, t2: T2 ) =>
		R;
export type GuardedFunction3< R, T1, T2, T3 > =
	( t1: T1, t2: T2, t3: T3 ) =>
		R;
export type GuardedFunction4< R, T1, T2, T3, T4 > =
	( t1: T1, t2: T2, t3: T3, t4: T4 ) =>
		R;
export type GuardedFunction5< R, T1, T2, T3, T4, T5 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5 ) =>
		R;
export type GuardedFunction6< R, T1, T2, T3, T4, T5, T6 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ) =>
		R;
export type GuardedFunction7< R, T1, T2, T3, T4, T5, T6, T7 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7 ) =>
		R;
export type GuardedFunction8< R, T1, T2, T3, T4, T5, T6, T7, T8 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8 ) =>
		R;

export type GuardedFunctionMaker =
	(
		< R >( fn: ( ) => R ) =>
			GuardedFunction0< R >
	) & (
		< R, T1 >(
			fn: ( t1: T1 ) => R
		) =>
			GuardedFunction1< R, T1 >
	) & (
		< R, T1, T2>(
			fn: ( t1: T1, t2: T2 ) => R
		) =>
			GuardedFunction2< R, T1, T2 >
	) & (
		< R, T1, T2, T3 >(
			fn: ( t1: T1, t2: T2, t3: T3 ) => R
		) =>
			GuardedFunction3< R, T1, T2, T3 >
	) & (
		< R, T1, T2, T3, T4 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4 ) => R
		) =>
			GuardedFunction4< R, T1, T2, T3, T4 >
	) & (
		< R, T1, T2, T3, T4, T5 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5 ) => R
		) =>
			GuardedFunction5< R, T1, T2, T3, T4, T5 >
	) & (
		< R, T1, T2, T3, T4, T5, T6 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ) => R
		) =>
			GuardedFunction6< R, T1, T2, T3, T4, T5, T6 >
	) & (
		< R, T1, T2, T3, T4, T5, T6, T7 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7 ) => R
		) =>
			GuardedFunction7< R, T1, T2, T3, T4, T5, T6, T7 >
	) & (
		< R, T1, T2, T3, T4, T5, T6, T7, T8 >( fn:
			( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8
			) => R
		) =>
			GuardedFunction8< R, T1, T2, T3, T4, T5, T6, T7, T8 >
	);

export type GuardedAsyncFunction0< R > =
	( ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction1< R, T1 > =
	( t1: T1 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction2< R, T1, T2 > =
	( t1: T1, t2: T2 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction3< R, T1, T2, T3 > =
	( t1: T1, t2: T2, t3: T3 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction4< R, T1, T2, T3, T4 > =
	( t1: T1, t2: T2, t3: T3, t4: T4 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction5< R, T1, T2, T3, T4, T5 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction6< R, T1, T2, T3, T4, T5, T6 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction7< R, T1, T2, T3, T4, T5, T6, T7 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7 ) =>
		R | PromiseLike< R >;
export type GuardedAsyncFunction8< R, T1, T2, T3, T4, T5, T6, T7, T8 > =
	( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8 ) =>
		R | PromiseLike< R >;

export type GuardedAsyncFunctionMaker =
	(
		< R >( fn: ( ) => R ) =>
			GuardedAsyncFunction0< R >
	) & (
		< R, T1 >(
			fn: ( t1: T1 ) => R | PromiseLike< R >
		) =>
			GuardedAsyncFunction1< R, T1 >
	) & (
		< R, T1, T2>(
			fn: ( t1: T1, t2: T2 ) => R | PromiseLike< R >
		) =>
			GuardedAsyncFunction2< R, T1, T2 >
	) & (
		< R, T1, T2, T3 >(
			fn: ( t1: T1, t2: T2, t3: T3 ) => R | PromiseLike< R >
		) =>
			GuardedAsyncFunction3< R, T1, T2, T3 >
	) & (
		< R, T1, T2, T3, T4 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4 ) => R | PromiseLike< R >
		) =>
			GuardedAsyncFunction4< R, T1, T2, T3, T4 >
	) & (
		< R, T1, T2, T3, T4, T5 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5 ) =>
				R | PromiseLike< R >
		) =>
			GuardedAsyncFunction5< R, T1, T2, T3, T4, T5 >
	) & (
		< R, T1, T2, T3, T4, T5, T6 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ) =>
				R | PromiseLike< R >
		) =>
			GuardedAsyncFunction6< R, T1, T2, T3, T4, T5, T6 >
	) & (
		< R, T1, T2, T3, T4, T5, T6, T7 >(
			fn: ( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7 ) =>
				R | PromiseLike< R >
		) =>
			GuardedAsyncFunction7< R, T1, T2, T3, T4, T5, T6, T7 >
	) & (
		< R, T1, T2, T3, T4, T5, T6, T7, T8 >( fn:
			( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8
			) => R | PromiseLike< R >
		) =>
			GuardedAsyncFunction8< R, T1, T2, T3, T4, T5, T6, T7, T8 >
	);


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

	return function< R >(
		fn: ( ...args: any ) => R
	)
	: GuardedFunction0< R >
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

	return function< R >( fn: ( ...args: any ) => R | PromiseLike< R > )
	: GuardedAsyncFunction0< R >
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
